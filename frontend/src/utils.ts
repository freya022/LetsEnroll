export async function checkAuthOrRedirect(response: Response) {
  if (response.status === 401) {
    location.href = "/oauth2/authorization/discord";
    // Wait while it redirects, this is done by never resolving the given function
    await new Promise(() => {});
  }
}

export async function fetcher(
  request: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(request, {
    ...init,
    headers: {
      ...init?.headers,
      "X-XSRF-TOKEN": getCsrfFromCookies(),
    },
  });
}

function getCsrfFromCookies() {
  if (!document.cookie) {
    return "";
  }

  const xsrfCookies = document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith("XSRF-TOKEN="));

  if (xsrfCookies.length === 0) {
    return "";
  }
  return xsrfCookies[0].split("=")[1];
}
