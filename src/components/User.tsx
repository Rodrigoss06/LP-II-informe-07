import { useModalBorrar } from "@/UserStore";
import { getCookie } from "@/authUtils";
import { Product, Transaccion, User } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";

function UserData({ user_id }: { user_id: number }) {
  const { setShowModalUser } = useModalBorrar((state) => state);

  const [user, setUser] = useState<User>();
  const [transacciones, setTransacciones] = useState<Transaccion[]>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/Users", {
          params: {
            user_id,
          },
        });
        if (response.data.user) {
          setUser(JSON.parse(response.data.user));
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error);
        setShowModalUser(false);
        return;
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    const getTransacciones = async () => {
      const token = getCookie("token");
      try {
        const response = await axios.post(
          "http://localhost:3000/api/Transacciones",
          {
            typeOpr: "obtener_transacciones",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.transacciones) {
          setTransacciones(JSON.parse(response.data.transacciones));
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error);
        setShowModalUser(false);
        return;
      }
    };
    getTransacciones();
  }, []);
  return (
    <section className="p-4">
      {user && (
        <div className="mx-auto rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-1">{user.nombre}</h1>
          <p className=" text-lg mb-4">{user.correo}</p>
          <div>
            <h2 className="text-xl font-semibold mb-3">Transacciones:</h2>
            <div className="gap-4 flex flex-wrap">
              {transacciones?.map((transaccion: Transaccion,index) => (
                <TransactionItem transaccion={transaccion} key={index}/>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserData;
