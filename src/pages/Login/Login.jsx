import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { CiMail, CiLock } from "react-icons/ci";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/login", { email, password });
      const { auth_token, user } = res.data;

      // Usamos el login del context para actualizar estado y localStorage
      login(user, auth_token);

      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-100 h-100 mx-auto mt-5 p-10 bg-white rounded shadow">
        <h2 className="text-2xl">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="text-black mt-6 space-y-6">
          <div>
            <label className="block mb-2">Email:</label>
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300">
              <CiMail className="text-gray-500 mr-2" size={20} />
              <input 
                className="bg-transparent flex-1 text-black p-2 focus:outline-none"
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Contraseña:</label>
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300">
              <CiLock className="text-gray-500 mr-2" size={20} />
              <input
                className="bg-transparent flex-1 text-black p-2 focus:outline-none"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="w-full flex justify-center mt-6">
            <button 
              type="submit" 
              className="bg-[#282c34] rounded-lg w-1/2 h-10 text-white hover:bg-[#343a40] hover:scale-110 transition duration-300"
            >
              Iniciar sesión
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};