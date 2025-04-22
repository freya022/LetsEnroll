import { redirect } from "react-router";

export function loader() {
  const lastLocation = localStorage.getItem("last_location");
  if (lastLocation) {
    return redirect(lastLocation);
  }

  return redirect("/dashboard");
}
