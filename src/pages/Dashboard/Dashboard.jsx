import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Select from "react-select";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const navigate = useNavigate();
  const { user, auth_token } = useContext(AuthContext);

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

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "pending", label: "Pendiente" },
    { value: "in_progress", label: "En progreso" },
    { value: "completed", label: "Completada" },
  ];

  const priorityOptions = [
    { value: "", label: "Todas las prioridades" },
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
  ];

  const sortOptions = [
    { value: "newest", label: "Más nuevas" },
    { value: "oldest", label: "Más antiguas " },
  ];

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
  // estilos personalizados para React Select
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

  useEffect(() => {
    if (!user || !auth_token) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get("tasks", {
          headers: { Authorization: `Bearer ${auth_token}` },
        });
        console.log(res)
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener tareas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, auth_token]);

  if (!user) {
    return (
      <div>
        <p>Debes iniciar sesión para ver tus tareas</p>
        <button onClick={() => navigate("/login")}>Ir a Login</button>
      </div>
    );
  }


if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

  if (error) return <p>{error}</p>;

  const baseTasks = Array.isArray(tasks)
  ? user.role === "admin"
    ? tasks
    : tasks.filter((task) => task.users?.some((u) => u.id === user.id))
  : [];

const filteredTasks = baseTasks.filter((t) => {
  const matchesSearch =
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(search.toLowerCase());

  const matchesStatus = status ? t.status === status : true;
  const matchesPriority = priority ? t.priority === priority : true;

  return matchesSearch && matchesStatus && matchesPriority;
});

  const sortedTasks = filteredTasks.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
  <div className="p-4">
  <h1 className="text-2xl font-bold mb-4">TAREAS</h1>

  {/* Contenedor de búsqueda y filtros */}
  <div className="flex flex-wrap gap-4 items-center mb-4">
    {/* Buscador */}
    <div className="relative flex-1 min-w-[250px]">
      {/* Icono */}
      <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />

      {/* Input */}
      <input
        type="text"
        placeholder="Buscar tarea..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border bg-[#F1F9FF] border-[#8B8C89] rounded-lg pl-10 pr-3 py-2 w-full focus:outline-none focus:border-[#274C77] transition duration-300"
      />
    </div>

    {/* Filtros */}
    <Select
      value={statusOptions.find((o) => o.value === status)}
      onChange={(option) => setStatus(option.value)}
      options={statusOptions}
      styles={customStyles}
      className="w-48"
    />
    <Select
      value={priorityOptions.find((o) => o.value === priority)}
      onChange={(option) => setPriority(option.value)}
      options={priorityOptions}
      styles={customStyles}
      className="w-48"
    />
    <Select
      value={sortOptions.find((o) => o.value === sortOrder)}
      onChange={(option) => setSortOrder(option.value)}
      options={sortOptions}
      styles={customStyles}
      className="w-48"
    />

    {/* Botón Limpiar */}
    <button
      onClick={() => {
        setSearch("");
        setStatus("");
        setPriority("");
        setSortOrder("newest");
      }}
      className="border px-4 py-2 rounded-lg bg-[#282c34] text-white hover:bg-[#343a40] hover:scale-105 transition duration-200"
    >
      Limpiar filtros
    </button>
  </div>
{/* Lista de tareas */}
{sortedTasks.length === 0 ? (
  <p>No se encontraron tareas</p>
) : (
  <div className="grid grid-cols-2 gap-4">
    {sortedTasks.map((task) => (
      <Link to={`/tasks/${task.id}`} key={task.id} className="no-underline">

      <div
        key={task.id}
        className="bg-[#F1F9FF] border border-gray-400 rounded p-6 space-y-3 hover:scale-101 transition-transform duration-200 shadow-md"
      >
        <h3 className="text-lg font-semibold">
          <span>
            {task.title}
          </span>
        </h3>
        
        <span
          className={`inline-block px-2 py-1 text-sm rounded mr-2 ${getStatusClasses(
          task.status
          )}`}
        >
        {statusLabels[task.status] || task.status}
        </span>

        {/* Priority */}
        <span
          className={`inline-block px-2 py-1 text-sm rounded ${getPriorityClasses(
            task.priority
          )}`}
        >
          {priorityLabels[task.priority] || task.priority}
        </span>

        <p>
          {" "}
          {task.users?.map((u) => u.name).join(", ") || "Ninguno"}
        </p>
      </div>
      </Link>
      
    ))}
  </div>
)}
  </div>
);

};
