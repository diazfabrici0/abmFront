import { Link, useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CiLogout } from "react-icons/ci";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // IMPORTANTE
  const navigate = useNavigate();

  if (!user) return null; // si no hay usuario logueado, no mostramos navbar

  const onClickLogoutHandler = () => {
    logout(); // limpia context y localStorage
    navigate("/login");
  };

  return (
    

    <nav className="flex justify-between items-center px-8 py-4 bg-[#282c34] text-white">
      <span className="font-bold">ToDo-List</span>

      <div className="flex center gap-3" >
        {/* Todos los usuarios ven Dashboard */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) =>`px-4  font-medium border-b-2 transition-all duration-300 ${
          isActive ? "border-[#274C77]" : "border-transparent text-white"
            }`
          }
        >
          Tareas
        </NavLink>

        {/* Solo admins */}
        {user.role === "admin" && (
          <>
            <NavLink 
              to="/users" 
              className={({ isActive }) =>`px-4  font-medium border-b-2 transition-all duration-300 ${
                isActive ? "border-[#274C77]" : "border-transparent text-white"
              }`
            }
            >
              Usuarios
            </NavLink>
            <NavLink 
              to="/tasks/new" 
                className={({ isActive }) =>`px-4  font-medium border-b-2 transition-all duration-300 ${
                  isActive ? "border-[#274C77]" : "border-transparent text-white"
                }`
              }
            >
              Nueva tarea
            </NavLink>
            <NavLink 
              to="/register" 
              className={({ isActive }) =>`px-4  font-medium border-b-2 transition-all duration-300 ${
                isActive ? "border-[#274C77]" : "border-transparent text-white"
              }`
            }
            >
              Registrar usuario
            </NavLink>
          </>
        )}

        <button className="border-none bg-transparent hover:cursor-pointer"
          onClick={onClickLogoutHandler} 
        >
          <CiLogout size={20} />
        </button>
      </div>
    </nav>
  );
};
