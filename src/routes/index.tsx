import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LocationPage from "../pages/LocationPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";
import ProjectInfoPage from "../pages/ProjectInfoPage";
import BrochurePage from "../pages/BrochurePage";
import CirculationPage from "../pages/CirculationPage";
import CertificationPage from "../pages/CertificationPage";
import Gallery from "../pages/Gallery";

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
    path: "/project-info",
    element: <ProjectInfoPage />,
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
  {
    path: "/certification",
    element: <CertificationPage />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
]);