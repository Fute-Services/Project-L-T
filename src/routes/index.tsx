import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LocationPage from "../pages/LocationPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";
import ProjectSpecificationPage from "../pages/ProjectSpecificationPage";
import BrochurePage from "../pages/BrochurePage";
import CirculationPage from "../pages/CirculationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/home",
    element: <HomePage startScene={3} />,
  },
  {
    path: "/location",
    element: <LocationPage />,
  },
  {
    path: "/project-specification",
    element: <ProjectSpecificationPage />,
  },
  {
    path: "/project-details",
    element: <ProjectDetailsPage />,
  },
  {
    path: "/brochure",
    element: <BrochurePage />,
  },
  {
    path: "/circulation",
    element: <CirculationPage />,
  },
]);