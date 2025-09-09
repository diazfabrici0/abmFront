import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { CiUser, CiMail, CiLock } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import Select from "react-select";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("standard");
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!user || user.role !== "admin") {
      setMessage("No estás autorizado");
      return;
    }

    try {
      const res = await api.post(
        "/register",
        { name, email, password, password_confirmation: confirmPassword, role },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario creado con éxito",
        showConfirmButton: false,
        timer: 2000
      });
      setMessage(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("standard");
    } catch (err) {
        console.log(err.response); 
      setMessage(err.response?.data?.message || "Error al registrar usuario");
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

  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "standard", label: "Standard" }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-7 space-y-3 bg-white rounded shadow-md w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <h2 className="text-2xl font-semibold">Registrar Usuario</h2>
          {message && <p>{message}</p>}

          <label className="text-gray-580 block mb-1"> Nombre</label>
          <div div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300">
            <CiUser className="text-gray-500 mr-2" size={20} />
              <input type="text" placeholder="Ingrese un nombre" 
              value={name} onChange={(e) => setName(e.target.value)} 
              required 
              className="bg-transparent flex-1 text-black p-2 focus:outline-none"
              />
          </div>
      
          <label className="text-gray-800 block mb-1"> Email</label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300">
          <CiMail />
          <input type="email" placeholder="Ingrese un email" 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          required 
          className="bg-transparent flex-1 text-black p-2 focus:outline-none"
          />
          </div>
     

          <label className="text-gray-800 block mb-1"> Contraseña</label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300">
          <CiLock />
          <input type="password" placeholder="Ingrese una contraseña" 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          required 
          className="bg-transparent flex-1 text-black p-2 focus:outline-none"
          />
          </div>
      

          <label className="text-gray-800 block mb-1"> Confirmar contraseña</label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#274C77] transition duration-300">
              <CiLock />
          <input type="password" placeholder="Repita la contraseña" 
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
          className="bg-transparent flex-1 text-black p-2 focus:outline-none"
          />
          </div>


          <label className="text-gray-800 block mb-1"> Rol</label>
          <div className="flex items-center ">
          <GrUserAdmin className="mr-2"/>
          <Select
            value={roleOptions.find(option => option.value === role)} 
            onChange={(selectedOption) => setRole(selectedOption.value)} 
            options={roleOptions}
            styles={customStyles}
            className="w-full"
          />
          </div>
      
          <button type="submit" className="px-4 py-2 bg-[#282c34] text-white rounded-lg hover:bg-[#343a40] hover:scale-105 transition duration-200">Registrar</button>
       </form>
      </div>
    </div>
  );
};