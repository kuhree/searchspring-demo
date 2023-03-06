import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/error";
import { HomePage, loader as homeLoader } from "./pages/home";
import { SearchPage, loader as searchLoader } from "./pages/search";
import { AppRoot } from "./pages/root";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppRoot />,
      errorElement: <ErrorPage />,
      children: [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <HomePage />,
              loader: homeLoader,
            },
            {
              path: "/search",
              element: <SearchPage />,
              loader: searchLoader,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/searchspring-demo" }
);
