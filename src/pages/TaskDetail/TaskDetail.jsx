import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../const/routes";
import { TaskCard } from "../../components/TaskCard/TaskCard";
import Swal from "sweetalert2";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { PiTrashLight } from "react-icons/pi";


export const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("auth_token");

  // Diccionarios
  const statusLabels = {
    pending: "Pendiente",
    in_progress: "En progreso",
    completed: "Completada",
  };

  const priorityLabels = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
  };

  // Obtener tarea
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch (err) {
        console.error("Error cargando tarea:", err);
        setMessage("No se pudo cargar la tarea ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, token]);

  if (loading) return <p>Cargando tarea...</p>;
  if (!task) return <p>No se encontró la tarea</p>;

  const isAssigned = task.users?.some((u) => u.id === user?.id);
  const isAdmin = user?.role === "admin";

  const handleConfirm = async () => {
    try {
      const res = await api.post(
        `/tasks/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Confirmado!",
        showConfirmButton: false,
        timer: 2000
      });

      setTask(res.data.task);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "No estas asignado a esta tarea!",
      });
    }
  };

    const handleDelete = async () => {
      const result = await Swal.fire({
      title: "¿Estás seguro de eliminar esta tarea?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire(
          "Eliminado",
          "Tarea eliminada con éxito",
          "success"
        );
        setTask(null);
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error",
          "No se pudo eliminar la tarea",
          "error"
        );
      }
    }
  };

    const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-[#C4E6DA] text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-[#C4E6DA] text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
  <div className=" min-h-screen p-10 flex justify-center items-start">
    <div className="bg-[#F1F9FF] w-full max-w-3xl rounded shadow-lg p-6 text-white">
      {/* Botón volver */}
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="flex items-center mb-4 text-sm text-gray-600 hover:text-black hover:cursor-pointer"
      >
        <FiArrowLeft className="mr-2" /> Volver
      </button>

      {/* Header tarea */}
      <h2 className="text-2xl text-black font-bold mb-6">
        {task.title}
      </h2>

      {/* Botones tipo Trello */}
      <div className="flex flex-wrap gap-2 mb-6">
      <div className="mb-2">
        <span className="text-xs text-gray-500 block mb-1">Estado</span>
        <span
          className={`inline-block px-2 py-1 text-sm rounded ${getStatusClasses(
            task.status
          )}`}
        >
          {statusLabels[task.status] || task.status}
        </span>
      </div>

        {/* Priority */}
        <div className="mb-2">
          <span className="text-xs text-gray-500 block mb-1">Prioridad</span>
          <span
            className={`inline-block px-2 py-1 text-sm rounded ${getPriorityClasses(
              task.priority
            )}`}
          >
            {priorityLabels[task.priority] || task.priority}
          </span>
        </div>

        <div className="mt-5">
          <button
            onClick={() => setShowUsers(true)}
            className="bg-[#282c34] hover:bg-[#44474E] hover:cursor-pointer px-3 py-1 rounded text-sm"
          >
            Ver miembros
          </button>
        </div>
      </div>

      {/* Sección descripción */}
      <div className="bg-[#E1E9F0] rounded-lg p-4 mb-6">
        <h3 className="text-md text-black font-semibold mb-2">Descripción</h3>
        <p className="text-gray-800">
          {task.description || "Añadir una descripción más detallada..."}
        </p>
      </div>

      {/* Modal usuarios */}
      {showUsers && (
        <div className="fixed inset-0 bg-black/50  flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg text-gray-800">
            <h3 className="text-lg font-semibold mb-4">Miembros</h3>
            <ul className="space-y-2">
              {task.users?.length > 0 ? (
                task.users.map((u) => (
                  <li key={u.id} className="border-b border-gray-200 pb-2">
                    <span className="font-medium">{u.name}</span>{" "}
                    <span className="text-gray-500 text-sm">({u.email})</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Ninguno</p>
              )}
            </ul>
            <button
              onClick={() => setShowUsers(false)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Contenedor de botones */}
      <div className="flex gap-2">
        {/* Botones según permisos */}
        {isAssigned && (
          <button
            className="hover:cursor-pointer border px-4 py-1 rounded-lg bg-[#282c34] text-white hover:bg-[#343a40] hover:scale-105 transition duration-200"
            onClick={handleConfirm}
          >
            Hecho
          </button>
        )}

        {(isAssigned || isAdmin) && (
          <button
            className="hover:cursor-pointer border px-4 py-1 rounded-lg bg-[#282c34] text-white hover:bg-[#343a40] hover:scale-105 transition duration-200 flex items-center gap-2"
            onClick={() => setEditing(true)}
          >
            <FiEdit className="w-4 h-4" />
            Editar tarea
          </button>
        )}

        {isAdmin && (
          <button
            className="hover:cursor-pointer bg-red-500 text-white px-2 py-1 rounded-lg hover:scale-105 transition duration-200 flex items-center gap-2"
            onClick={handleDelete}
          >
            <PiTrashLight />
            Eliminar tarea
          </button>
        )}
      </div>

        {editing && ( 
          <div className="
            fixed top-0 left-0
            w-screen h-screen 
            bg-black/50 flex 
            justify-center text-black 
            items-center z-[1000]
            "  > 
            <div className="mt-10 mb-10 max-h-[100vh] overflow-auto">
           <TaskCard id={id} onClose={() => setEditing(false)} // cerrar modal 
           onUpdate={(updatedTask) => setTask(updatedTask)} /> 
            </div>
           
          </div> 
        )}
    </div>
  </div>
);
};