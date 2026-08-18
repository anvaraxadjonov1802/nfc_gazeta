import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  authenticatedBackendFetch,
  createBackendProxyResponse,
} from "@/lib/server/authenticated-backend";
import {
  fetchAishaAudioBytes,
  mergeWavBuffers,
  requestAishaAudioPath,
  splitTextIntoChunks,
} from "@/lib/server/aisha-tts";
import { uploadAudioToBlob } from "@/lib/server/audio-storage";
import type {
  NewspaperPageDetail,
  NewspaperPageListItem,
} from "@/lib/issues";

// A full issue can have a dozen+ pages, each split into several TTS
// requests — this can legitimately take minutes. Vercel Hobby projects cap
// function duration well below this regardless of what we ask for here; on
// Hobby this route should be expected to time out partway through and be
// re-run (already-generated pages are skipped, see below), or the project
// should be upgraded for a single uninterrupted run.
export const maxDuration = 300;

interface GenerateAudioRouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface PageAudioResult {
  page_id: number;
  page_number: number;
  status: "generated" | "skipped" | "failed";
  message?: string;
}

export async function POST(
  request: NextRequest,
  context: GenerateAudioRouteContext,
) {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      {
        detail:
          "Nashr identifikatori noto‘g‘ri.",
      },
      {
        status: 400,
      },
    );
  }

  const apiKey = process.env.AISHA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        detail:
          "AISHA_API_KEY muhit o‘zgaruvchisi sozlanmagan. Serverga shu o‘zgaruvchini qo‘shib qayta joylashtiring.",
      },
      {
        status: 500,
      },
    );
  }

  const requestBody = await request
    .json()
    .catch(() => ({}));

  const force = Boolean(
    (requestBody as { force?: boolean })
      ?.force,
  );

  const pagesResult =
    await authenticatedBackendFetch(
      `/api/admin/issues/${id}/pages/`,
      () => ({
        method: "GET",
      }),
    );

  if (!pagesResult.backendResponse?.ok) {
    return createBackendProxyResponse(
      pagesResult,
    );
  }

  const pages =
    (await pagesResult.backendResponse.json()) as NewspaperPageListItem[];

  const results: PageAudioResult[] = [];

  for (const pageSummary of pages) {
    try {
      const pageDetailResult =
        await authenticatedBackendFetch(
          `/api/admin/pages/${pageSummary.id}/`,
          () => ({
            method: "GET",
          }),
        );

      if (
        !pageDetailResult.backendResponse?.ok
      ) {
        results.push({
          page_id: pageSummary.id,
          page_number:
            pageSummary.page_number,
          status: "failed",
          message:
            "Bet ma’lumotini olib bo‘lmadi.",
        });
        continue;
      }

      const pageDetail =
        (await pageDetailResult.backendResponse.json()) as NewspaperPageDetail;

      if (pageDetail.audio && !force) {
        results.push({
          page_id: pageDetail.id,
          page_number:
            pageDetail.page_number,
          status: "skipped",
          message:
            "Bu bet uchun ovoz allaqachon mavjud.",
        });
        continue;
      }

      const text = (
        pageDetail.final_text || ""
      ).trim();

      if (!text) {
        results.push({
          page_id: pageDetail.id,
          page_number:
            pageDetail.page_number,
          status: "skipped",
          message:
            "Bu betda yakuniy matn topilmadi.",
        });
        continue;
      }

      const chunks =
        splitTextIntoChunks(text);

      const audioBuffers: ArrayBuffer[] =
        [];

      for (const chunk of chunks) {
        const audioPath =
          await requestAishaAudioPath(
            chunk,
            apiKey,
          );

        const bytes =
          await fetchAishaAudioBytes(
            audioPath,
            apiKey,
          );

        audioBuffers.push(bytes);
      }

      const mergedWav =
        mergeWavBuffers(audioBuffers);

      const blobUrl =
        await uploadAudioToBlob(
          mergedWav,
          `issue-audio/${id}/page-${pageDetail.page_number}.wav`,
        );

      const patchResult =
        await authenticatedBackendFetch(
          `/api/admin/pages/${pageDetail.id}/`,
          () => ({
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              audio: blobUrl,
            }),
          }),
        );

      if (
        !patchResult.backendResponse?.ok
      ) {
        results.push({
          page_id: pageDetail.id,
          page_number:
            pageDetail.page_number,
          status: "failed",
          message:
            "Ovoz yaratildi, lekin betga saqlab bo‘lmadi.",
        });
        continue;
      }

      results.push({
        page_id: pageDetail.id,
        page_number: pageDetail.page_number,
        status: "generated",
      });
    } catch (pageError) {
      results.push({
        page_id: pageSummary.id,
        page_number:
          pageSummary.page_number,
        status: "failed",
        message:
          pageError instanceof Error
            ? pageError.message
            : "Kutilmagan xatolik.",
      });
    }
  }

  return NextResponse.json({
    detail:
      "Ovoz yaratish jarayoni yakunlandi.",
    results,
  });
}
