import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { loader as rootLoader, Root } from "./Root.tsx";
import ErrorPage from "./ErrorPage.tsx";
import { Main } from "./routes/Main.tsx";
import { Dashboard } from "./routes/Dashboard.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
