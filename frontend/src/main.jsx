import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Root from './routes/root.jsx';
import Description from './routes/home.jsx';
import Empleados from './routes/empleados.jsx';
import Roles from './routes/roles.jsx';
import Departamentos from './routes/departamentos.jsx';

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
        element: <Empleados/>
      },
      {
        path: "/departamentos",
        element: <Departamentos/>
      },

      {
        path:"/roles",
        element: <Roles/>

      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
