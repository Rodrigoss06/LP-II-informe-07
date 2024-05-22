import { useUserStore } from "@/UserStore";
import { UserLogin, UserRegister } from "@/types";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";

function LoginRegisterForm() {
  const [registerOrLogin, setRegisterOrLogin] = useState("login");
  const [userLogin, setUserLogin] = useState<UserLogin>({
    correo: "",
    password: "",
  });
  const [userRegister, setUserRegister] = useState<UserRegister>({
    nombre: "",
    correo: "",
    password: "",
  });

  const {setLoggin,setUser_id} = useUserStore((state)=>state)
  const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (registerOrLogin === "login") {
      const response = await axios.get("api/LoginOrRegister", {
        params: {
          type: registerOrLogin,
          userDataString: JSON.stringify(userLogin),
        },
      });
      if (response.data.authenticated) {
        const {token,user_id} = response.data
        alert(response.data.message)
        setLoggin(token)
        setUser_id(token)
        setUserLogin({ correo: "", password: "" });
      }
    } else if (registerOrLogin === "crear_cuenta") {
      const response = await axios.get("api/LoginOrRegister", {
        params: {
          type: registerOrLogin,
          userDataString: JSON.stringify(userRegister),
        },
      });
      if (response.data.authenticated) {
        alert(response.data.message)
        setUserRegister({ nombre: "", correo: "", password: "" });
      }
    }

  };
  return (
    <section>
      <div className="border border-white flex justify-around rounded my-2 py-1">
        <button
          onClick={() => setRegisterOrLogin("login")}
          className={registerOrLogin === "login" ? "bg-slate-500" : ""}
        >
          INICIAR SESIÓN
        </button>
        <button
          onClick={() => setRegisterOrLogin("crear_cuenta")}
          className={registerOrLogin === "crear_cuenta" ? "bg-slate-500" : ""}
        >
          REGÍSTRATE
        </button>
      </div>
      <div className="border-t-2 py-3 mt-4" />
      {registerOrLogin === "login" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
          <input
            type="email"
            placeholder="Correo"
            required
            value={userLogin.correo}
            onChange={(e) =>
              setUserLogin((state) => ({ ...state, correo: e.target.value }))
            }
            className="p-1 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={userLogin.password}
            onChange={(e) =>
              setUserLogin((state) => ({ ...state, password: e.target.value }))
            }
            className="p-1 rounded"
          />
          <button type="submit" className="border border-white p-1 text-white">Iniciar Sesión</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
          <input
            type="text"
            placeholder="Nombre"
            required
            value={userRegister.nombre}
            onChange={(e) =>
              setUserRegister((state) => ({ ...state, nombre: e.target.value }))
            }
            className="p-1 rounded"
          />
          <input
            type="text"
            placeholder="Correo"
            required
            value={userRegister.correo}
            onChange={(e) =>
              setUserRegister((state) => ({ ...state, correo: e.target.value }))
            }
            className="p-1 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={userRegister.password}
            onChange={(e) =>
              setUserRegister((state) => ({
                ...state,
                password: e.target.value,
              }))
            }
            className="p-1 rounded"
          />
          <button type="submit" className="border border-white p-1 text-white">Crear Cuenta</button>
        </form>
      )}
    </section>
  );
}

export default LoginRegisterForm;
