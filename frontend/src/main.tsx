import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "@/root.tsx";
import ErrorPage from "@/error-page.tsx";
import Home from "@/routes/home.tsx";
import Dashboard from "@/routes/dashboard.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import RolesConfigPanel from "@/roles-config-editor/routes/roles-config-panel.tsx";
import RolesConfigEditor from "@/roles-config-editor/routes/roles-config-editor.tsx";
import RolesConfigPublisher from "@/roles-config-editor/routes/roles-config-publisher.tsx";
import { loader as LoginSuccessLoader } from "@/routes/login-success.tsx";

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
        element: <Home />,
      },
      {
        path: "/dashboard",
        loader: Dashboard.loader,
        element: <Dashboard />,
        id: "dashboard",
        children: [
          {
            path: ":guildId/roles",
            children: [
              {
                index: true,
                loader: RolesConfigPanel.loader,
                errorElement: <ErrorPage />,
                element: <RolesConfigPanel />,
              },
              {
                path: "edit",
                loader: RolesConfigEditor.loader,
                action: RolesConfigEditor.action,
                element: <RolesConfigEditor />,
              },
              {
                path: "publish",
                loader: RolesConfigPublisher.loader,
                action: RolesConfigPublisher.action,
                element: <RolesConfigPublisher />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login/success",
    loader: LoginSuccessLoader,
    element: <></>,
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
