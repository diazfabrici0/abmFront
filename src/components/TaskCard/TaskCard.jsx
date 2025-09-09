import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { UserSelect } from "../UserSelect/UserSelect";
import Swal from "sweetalert2";
import Select from "react-select";

export const TaskCard = ({ id, onClose, onUpdate }) => {
  const { user, auth_token } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editing, setEditing] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", status: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${auth_token}` },
        });
        setTask(res.data);
        setForm({
          title: res.data.title,
          description: res.data.description || "",
          status: res.data.status,
          priority: res.data.priority,
        });
        setSelectedUsers(res.data.users.map((u) => u.id));
      } catch (err) {
        setError("Error al obtener la tarea");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, auth_token]);

  // Guardar cambios (incluye asignación solo si es admin)
  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (user?.role === "admin") {
        payload.user_ids = selectedUsers;
      }

      const res = await api.put(`/tasks/${id}`, payload, {
        headers: { Authorization: `Bearer ${auth_token}` },
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cambios guardados!",
        showConfirmButton: true,
      });

      setTask(res.data);
      setSelectedUsers(res.data.users.map((u) => u.id) || []);
      if (onUpdate) onUpdate(res.data);
      if (onClose) onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudieron guardar los cambios!",
      });
      console.error(err);
      setMessage("Error al actualizar tarea");
    }
  };

  const handleCancel = () => {
    if (onUpdate && task) onUpdate(task);
    if (onClose) onClose();
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!task) return <p>Tarea no encontrada</p>;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#F1F9FF",
      borderColor: state.isFocused ? "#274C77" : "#8B8C89",
      boxShadow: state.isFocused ? "0 0 0 1px #274C77" : "none",
      "&:hover": { borderColor: "#274C77" },
      borderRadius: "0.3rem",
      minHeight: "2.5rem",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1a1a1a",
      color: "white",
      borderRadius: "0.3rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#274C77"
        : state.isFocused
        ? "#343a40"
        : "#1a1a1a",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#274C77",
      "&:hover": { color: "#274C77" },
    }),
  };


  const statusOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "in_progress", label: "En progreso" },
    { value: "completed", label: "Completada" },
  ];

  const priorityOptions = [
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
  ];

  return (
    <div className="p-6 space-y-3  rounded shadow-md bg-white w-full">
      <h2 className="text-3xl font-semibold">Editar tarea</h2>
      {message && <p>{message}</p>}

      {editing ? (
        <>
          <label className="text-gray-500 block mb-1">Titulo</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border-b-2 p-1 border-gray-300 focus-within:border-[#274C77] transition duration-300 focus:outline-none w-full "
          />
            <label className="text-gray-500 block mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border-b-2 p-1 border-gray-300 focus-within:border-[#274C77] transition duration-300 focus:outline-none w-full "
          />
          <div className="flex gap-4">
            {/* Estado */}
            <div className="flex flex-col">
              <label className="text-gray-500 block mb-1">Estado</label>
              <Select
                value={statusOptions.find(option => option.value === form.status)}
                onChange={(selectedOption) =>
                  setForm({ ...form, status: selectedOption.value })
                }
                options={statusOptions}
                styles={customStyles}
                className="w-48"
              />
            </div>

            {/* Prioridad */}
            <div className="flex flex-col">
              <label className="text-gray-500 block mb-1">Prioridad</label>
              <Select
                value={priorityOptions.find(option => option.value === form.priority)}
                onChange={(selectedOption) =>
                  setForm({ ...form, priority: selectedOption.value })
                }
                options={priorityOptions}
                styles={customStyles}
                className="w-48"
              />
            </div>
          </div>

        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{task.title}</h2>
          <p className="text-gray-700 mb-2">{task.description}</p>
          <p>
            <strong>Estado:</strong> {task.status}
          </p>
          <p>
            <strong>Prioridad:</strong> {task.priority}
          </p>
        </>
      )}
     <div className="mt-4 flex gap-4">
        {/* Contenedor de usuarios asignados */}
        <div className="bg-[#F1F9FF] w-[400px] rounded-xl p-6 text-gray-800">
          <h3 className="text-lg font-semibold mb-4">Usuarios asignados</h3>
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
        </div>

          {/* UserSelect visible solo para admin */}
          {user?.role === "admin" && (
            <div className="w-[400px]">
              <UserSelect
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
              />
            </div>
          )}
      </div>
      <div className="pt-3 space-x-2">
        <button
        onClick={handleSave}
        className="hover:cursor-pointer  px-4 py-1 rounded-lg bg-[#282c34] text-white hover:bg-[#475058] hover:scale-105 transition duration-200"
      >
        Guardar
      </button>
      <button
        onClick={handleCancel}
        className="hover:cursor-pointer  px-4 py-1 rounded-lg bg-gray-300 text-gray hover:bg-[#9099A0] hover:scale-105 hover:text-white transition duration-200"
      >
        Cancelar
      </button>
      </div>
      
    </div>
  );
};
