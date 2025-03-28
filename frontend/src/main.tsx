import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "@/Root.tsx";
import ErrorPage from "@/ErrorPage.tsx";
import Main from "@/routes/Main.tsx";
import Dashboard from "@/routes/Dashboard.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import RolesConfigPanel from "@/routes/RolesConfigPanel.tsx";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: Root.loader,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "/dashboard",
        loader: Dashboard.loader,
        element: <Dashboard />,
        children: [
          {
            path: ":guildId",
            loader: RolesConfigPanel.loader,
            action: RolesConfigPanel.action,
            errorElement: <ErrorPage />,
            element: <RolesConfigPanel />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
