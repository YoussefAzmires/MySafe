import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SafetyHub from "./pages/SafetyHub";
import WorldwideInsights from "./pages/WorldwideInsights";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/safety-hub",
    element: <SafetyHub />,
  },
  {
    path: "/worldwide-insights",
    element: <WorldwideInsights />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;