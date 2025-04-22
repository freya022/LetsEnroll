import { isRouteErrorResponse, useRouteError } from "react-router";
import { AxiosError } from "axios";

export default function ErrorPage() {
  const error = useRouteError();

  // https://stackoverflow.com/a/76126878
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof AxiosError && error.status === 401) {
    localStorage.setItem("last_location", location.href);
    location.href = "/oauth2/authorization/discord";
    errorMessage = "Not authorized, redirecting to login page...";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "Unknown error";
  }
  console.error(error);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-5">
      <h1 className="text-4xl font-semibold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="dark:text-gray-500">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
