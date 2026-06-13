export async function getApiErrorMessage(error: unknown, fallback: string) {
  const response = typeof error === "object" && error !== null && "response" in error
    ? (error as { response?: Response }).response
    : undefined;

  if (response) {
    try {
      const body = await response.clone().json() as { message?: string; error?: string };
      return body.message ?? body.error ?? fallback;
    } catch {
      return fallback;
    }
  }

  return error instanceof Error && error.message ? error.message : fallback;
}
