import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { LuUserCheck } from "react-icons/lu";
import { IoIosCheckmark } from "react-icons/io";
import { CiSearch } from "react-icons/ci";



export const UserSelect = ({ selectedUsers, setSelectedUsers }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  // Cargar todos los usuarios (solo si es admin)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar usuarios", err);
      }
    };

    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // Manejar selección
  const handleUserSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}


  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Asignar usuarios</h2>
      
<div className="relative w-full">
  {/* Icono */}
  <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />

  {/* Input */}
  <input
    type="text"
    placeholder="Buscar usuario..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border bg-[#F1F9FF] border-[#8B8C89] rounded-lg pl-10 pr-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:border-[#274C77] transition duration-300 w-full"
  />
    </div>
        <div className="bg-[#F1F9FF] w-full rounded-xl p-6 w-[400px] text-left text-gray-800">
        <table border="1" width="100%" cellPadding="8">
            <thead>
              <tr>
                <th><LuUserCheck /></th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((u) => (
                  <tr key={u.id}>
                    <td>
                      <label className="inline-flex items-center cursor-pointer relative group">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => handleUserSelect(u.id)}
                          className="absolute opacity-0 w-5 h-5"
                        />
                        <div className="w-4 h-4 bg-[#282c34]  rounded flex items-center justify-center">
                          <IoIosCheckmark className="text-white opacity-0 transition-opacity duration-200 group-has-[input:checked]:opacity-100" />
                        </div>
                      </label>
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      
    </div>
  );
};
