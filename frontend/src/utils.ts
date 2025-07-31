import { AxiosError } from "axios";

export const MANAGE_SERVER = BigInt(1) << BigInt(5);
export const MANAGE_ROLES = BigInt(1) << BigInt(28);

export async function checkAuthOrRedirect(response: Response) {
  if (response.status === 401) {
    localStorage.setItem("last_location", location.href);
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

type BackendError = {
  error: string;
};

export function getErrorMessage(error: AxiosError): string {
  const response = error.response;
  if (response) {
    return (response.data as BackendError).error;
  }

  return error.message;
}

export function hasPermission(set: string, ...requested: bigint[]): boolean {
  return requested.every(
    (permission) => (BigInt(set) & permission) === permission,
  );
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
