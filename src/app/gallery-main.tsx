import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Gallery from '../pages/Gallery'
import '../styles/index.css'

// The main site is the single-file app in index.html; only the gallery runs on React.
// Navbar links to any other page leave the React app and load the main site.
const BackToSite = () => {
  useEffect(() => {
    window.location.replace('/')
  }, [])
  return null
}

const router = createBrowserRouter([
  { path: '/gallery', element: <Gallery /> },
  { path: '/gallery.html', element: <Gallery /> },
  { path: '*', element: <BackToSite /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
