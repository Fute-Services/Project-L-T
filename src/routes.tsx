import { createBrowserRouter } from "react-router-dom";

// Point exactly to the Pages folder based on your screenshot
import Home from "./Pages/Home";
import Location from "./Pages/Location";
import ProjectDetails from "./Pages/ProjectDetails";
import ProjectSpecification from "./Pages/ProjectSpecification";
import Brochure from "./Pages/Broucher";
import Cerculation from "./Pages/Cerculation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, 
  },
  {
    path: "/home",
    element: <Home startScene={3} />, 
  },
  {
    path: "/location",
    element: <Location />,
  },
  {
    path: "/project-specification",
    element: <ProjectSpecification />,
  },
  {
    path: "/project-details",
    element: <ProjectDetails />,
  },
  {
    path: "/brochure",
    element: <Brochure />,
  },
  {
    path: "/circulation",
    element: <Cerculation />,
  },
]);