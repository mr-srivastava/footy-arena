export async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit & { signal?: AbortSignal },
): Promise<T> {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & { detail?: string };

  if (!response.ok) {
    throw new Error(data.detail ?? "Request failed");
  }

  return data;
}
