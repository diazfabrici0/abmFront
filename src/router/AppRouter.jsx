import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PagesRoutes } from "../routes/PagesRoutes";
import { ROUTES } from "../const/routes";
import { Login, Register, Dashboard, TaskDetail, TaskForm, Users } from "../pages";

// rutas públicas
const publicRoutes = [
    {
        path: "/",
        element: <Login />
    },
    {
        path: ROUTES.LOGIN,
        element: <Login />
    }

];

// rutas protegidas
const protectedRoutes = [
    {
        path: ROUTES.REGISTER,
        element: <Register />
    },
    {
        path: "/dashboart",
        element: <Dashboard />
    },
    {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />
    },
    {
        path: "/tasks/new",
        element: <TaskForm />
    },
    {
        path: "/tasks/:id",
        element: <TaskDetail />
    },
    {
        path: "/users",
        element: <Users />
    }
];

const router = createBrowserRouter([
    // rutas públicas
    ...publicRoutes,
    // rutas protegidas envueltas en PagesRoutes
    {
        element: <PagesRoutes />,
        children: protectedRoutes
    }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
