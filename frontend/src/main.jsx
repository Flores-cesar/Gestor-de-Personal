import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Root from './routes/root.jsx';
import Description from './routes/home.jsx';

const router = createBrowserRouter([
  { path: "/", element:<Root/>, 
    children: [
      {
        index: true,
        element: <Description/>,
      },
      {
        path: "/descripcion",
        element: <Description/>
      },
      {
        path: "/empleados",
        element: <App/>
      },
      {
        path: "/departamentos",
        element: <Description/>
      },

      {
        path:"/roles",
        element: <Description/>

      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
