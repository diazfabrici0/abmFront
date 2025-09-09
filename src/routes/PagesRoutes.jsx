import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../const/routes";
import { Navbar } from "../components";
import { use, useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export const PagesRoutes = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const adminRoutes = [ROUTES.REGISTER, ROUTES.USERS, ROUTES.TASK_FORM];

    if (user === null) return <p>Cargando...</p>;

    if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

    if (adminRoutes.includes(location.pathname) && user.role !== "admin") {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <>
            <Navbar/>
            <div className="flex flex-col min-h-[100vh]">
                <Outlet />
            </div>
        </>
    );
};