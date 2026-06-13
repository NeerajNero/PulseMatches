import { getAccessToken } from "@/lib/auth-token-store";
import { getApiBaseUrl } from "@/lib/apis/api";

export type DownloadParams = Record<string, string | number | boolean | null | undefined>;

export async function downloadAuthenticatedCsv(path: string, params: DownloadParams = {}) {
  const url = new URL(path, getApiBaseUrl());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${getAccessToken() ?? ""}`
    }
  });

  if (!response.ok) {
    throw new Error(await getDownloadError(response));
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = getFilename(response.headers.get("Content-Disposition")) ?? "export.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
}

async function getDownloadError(response: Response) {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as { message?: string; error?: { message?: string } };
    return body.message ?? body.error?.message ?? `Export failed with status ${response.status}`;
  } catch {
    return text || `Export failed with status ${response.status}`;
  }
}

function getFilename(contentDisposition: string | null) {
  if (!contentDisposition) {
    return null;
  }
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return match?.[1] ?? null;
}
