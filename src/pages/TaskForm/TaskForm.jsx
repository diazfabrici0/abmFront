import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../const/routes";
import { UserSelect } from "../../components/UserSelect/UserSelect";
import Swal from "sweetalert2";
import Select from "react-select";

export const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!user || user.role !== "admin") {
      setMessage("No estás autorizado");
      return;
    }

    try {
      await api.post(
        "/tasks",
        {
          title,
          description,
          status,
          priority,
          user_ids: selectedUsers,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );


      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tarea creada con éxito",
        showConfirmButton: false,
        timer: 2000
      });
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
      setSelectedUsers([]);

      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al crear la tarea ❌");
    }
  };

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
      borderRadius: "0.5rem",
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
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-7 space-y-3 bg-white rounded shadow-md w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold">Crear Nueva Tarea</h2>
          {message && <p>{message}</p>}

          <label className="text-gray-500 block mb-1">Título</label>
          <input
            type="text"
            placeholder="Ingrese un título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300 focus:outline-none w-full"
            required
          />

          <label className="text-gray-500 block mb-1">Descripción</label>
          <textarea
            placeholder="Ingrese una descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300 focus:outline-none w-full"
          />

          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-gray-500 block mb-1">Estado</label>
              <Select
                value={statusOptions.find(option => option.value === status)}
                onChange={(selectedOption) => setStatus(selectedOption.value)}
                options={statusOptions}
                styles={customStyles}
                className="w-48"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500 block mb-1">Prioridad</label>
              <Select
                value={priorityOptions.find(option => option.value === priority)}
                onChange={(selectedOption) => setPriority(selectedOption.value)}
                options={priorityOptions}
                styles={customStyles}
                className="w-48"
              />
            </div>
          </div>

          <UserSelect
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />

          <button
            type="submit"
            className="px-4 py-2 bg-[#282c34] text-white rounded-lg hover:bg-[#343a40] hover:scale-105 transition duration-200"
          >
            Crear Tarea
          </button>
        </form>
      </div>
    </div>
  );
};