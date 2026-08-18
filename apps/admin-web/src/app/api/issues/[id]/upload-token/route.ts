import { cookies } from "next/headers";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_COOKIE_NAME,
  getAuthCookieOptions,
  REFRESH_COOKIE_MAX_AGE,
  REFRESH_COOKIE_NAME,
} from "@/lib/server/auth-cookies";
import {
  authenticatedBackendFetch,
  createBackendProxyResponse,
} from "@/lib/server/authenticated-backend";
import { getBackendUrl } from "@/lib/server/backend";

interface UploadTokenRouteContext {
  params: Promise<{
    id: string;
  }>;
}

// Large PDF uploads can't go through this Next.js route on Vercel — the
// platform hard-caps Serverless Function request bodies at ~4.5 MB
// regardless of any app-level config, so anything bigger than a few pages
// gets rejected with 413 before our handler code even runs. Instead, the
// browser uploads the PDF directly to the Django backend (which has no
// such limit), using a short-lived access token this route hands out.
// This route itself only ever returns a small JSON payload, so it never
// hits the Vercel body-size limit.
export async function GET(
  request: NextRequest,
  context: UploadTokenRouteContext,
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

  // Piggyback on the existing authenticated-fetch helper against a cheap,
  // side-effect-free backend endpoint purely to (a) confirm the caller is
  // actually authenticated for this issue and (b) get a guaranteed-valid,
  // possibly just-refreshed access token.
  const result = await authenticatedBackendFetch(
    `/api/admin/issues/${id}/`,
    () => ({
      method: "GET",
    }),
  );

  if (!result.backendResponse?.ok) {
    return createBackendProxyResponse(result);
  }

  const cookieStore = await cookies();

  const accessToken =
    result.newAccessToken ??
    cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        detail:
          "Administrator sessiyasi tugagan. Qayta kiring.",
      },
      {
        status: 401,
      },
    );
  }

  const response = NextResponse.json({
    upload_url: `${getBackendUrl()}/api/admin/issues/${id}/upload-pdf/`,
    access_token: accessToken,
  });

  if (result.newAccessToken) {
    response.cookies.set(
      ACCESS_COOKIE_NAME,
      result.newAccessToken,
      getAuthCookieOptions(
        ACCESS_COOKIE_MAX_AGE,
      ),
    );
  }

  if (result.newRefreshToken) {
    response.cookies.set(
      REFRESH_COOKIE_NAME,
      result.newRefreshToken,
      getAuthCookieOptions(
        REFRESH_COOKIE_MAX_AGE,
      ),
    );
  }

  return response;
}
