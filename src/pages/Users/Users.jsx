import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { CiSearch } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";


export const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { user, auth_token } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("No estás autorizado para ver los usuarios");
      setLoading(false); // <--- importante
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError("Error al obtener usuarios");
      } finally {
        setLoading(false); // <--- asegurate de apagar el loading
      }
    };

    fetchUsers();
  }, [user]);

    const handleDelete = async (id) => {
      const result = await Swal.fire({
        title: "¿Estás seguro de eliminar a este usuario?",
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
            await api.delete(`/users/${id}`, {
              headers: { Authorization: `Bearer ${auth_token}` },
            });

            setUsers((prev) => prev.filter((u) => u.id !== id));

            Swal.fire(
              "Eliminado",
              "Usuario eliminado con éxito",
              "success"
            );
          } catch (err) {
            console.error(err);
            Swal.fire(
              "Error",
              "No se pudo eliminar el usuario",
              "error"
            );
          }
        }

  };

    const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );


  if (error) return <p>{error}</p>;
if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

if (error) return <p>{error}</p>;


  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>

      {/* Buscador */}
      <div className="relative w-full max-w-md mb-4">
        <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border bg-[#F1F9FF] border-[#8B8C89] rounded-lg pl-10 pr-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:border-[#274C77] transition duration-300 w-full"
        />
      </div>

 {/* Tabla */}
<table className="w-full bg-[#F1F9FF] border border-gray-300 rounded overflow-hidden shadow-sm">
  <thead className="text-left ">
    <tr>
      <th className="px-4 py-2 border-b border-gray-300">Nombre</th>
      <th className="px-4 py-2 border-b border-gray-300">Email</th>
      <th className="px-4 py-2 border-b border-gray-300">Rol</th>
      <th className="px-4 py-2 border-b border-gray-300">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {filteredUsers.map((u) => (
      <tr
        key={u.id}
        className="hover:bg-gray-200  transition-colors duration-200 text-gray-500"
      >
        <td className="px-4 py-2 border-b border-gray-200">{u.name}</td>
        <td className="px-4 py-2 border-b border-gray-200">{u.email}</td>
        <td className="px-4 py-2 border-b border-gray-200">{u.role}</td>
        <td className="px-4 py-2 border-b border-gray-200">
          <button
            onClick={() => handleDelete(u.id)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center hover:scale-102"
          ><PiTrashLight />
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {filteredUsers.length === 0 && (
        <p className="text-gray-500 mt-4">No se encontraron usuarios.</p>
      )}
    </div>
  );
};

const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "left" };
const tdStyle = { border: "1px solid #ccc", padding: "8px" };
