import { BSD_ALLOWED_PATH_PREFIXES, BSD_BASE_URL } from "@/lib/bsd/constants";

export class BsdApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BsdApiError";
  }
}

export function hasBsdToken() {
  return Boolean(process.env.BSD_API_TOKEN?.trim());
}

function isAllowedBsdPath(path: string) {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return BSD_ALLOWED_PATH_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

export async function bsdFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = process.env.BSD_API_TOKEN?.trim();
  if (!token) {
    throw new BsdApiError("BSD_API_TOKEN is not configured", 503);
  }

  const normalized = path.replace(/^\/+|\/+$/g, "");
  const pathname = normalized.split("?")[0] ?? normalized;
  if (!isAllowedBsdPath(pathname)) {
    throw new BsdApiError("Path not allowed", 400);
  }

  const url = new URL(pathname.endsWith("/") ? pathname : `${pathname}/`, BSD_BASE_URL);
  const query = normalized.includes("?") ? normalized.split("?")[1] : null;
  if (query) url.search = query;

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
      ...init?.headers,
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      // ignore parse errors
    }
    throw new BsdApiError(detail, response.status);
  }

  return response.json() as Promise<T>;
}
