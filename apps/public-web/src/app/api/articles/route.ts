import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_API_URL = (
  process.env.BACKEND_API_URL ??
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function GET(request: NextRequest) {
  const incoming = new URL(request.url);
  const searchParams = new URLSearchParams();

  const category = incoming.searchParams.get(
    "category",
  );
  const search = incoming.searchParams.get(
    "search",
  );
  const issue = incoming.searchParams.get(
    "issue",
  );

  if (category) {
    searchParams.set("category", category);
  }

  if (search) {
    searchParams.set("search", search);
  }

  if (issue) {
    searchParams.set("issue", issue);
  }

  const query = searchParams.toString();

  try {
    const backendResponse = await fetch(
      `${BACKEND_API_URL}/api/public/articles/${
        query ? `?${query}` : ""
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await backendResponse
      .json()
      .catch(() => null);

    return NextResponse.json(data ?? [], {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "Backend serveriga ulanib bo‘lmadi.",
      },
      {
        status: 503,
      },
    );
  }
}
