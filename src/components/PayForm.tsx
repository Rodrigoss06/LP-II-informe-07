import React, { ChangeEvent, useState } from "react";
import bcrypt from "bcrypt";
import axios from "axios";
import { useProductsStore, useUserStore } from "@/UserStore";
import { Product } from "@/types";
function PayForm() {
  const [nroTarjeta, setNroTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");
  const {products} = useProductsStore((state)=>state)

  const { loggin } = useUserStore((state) => state);

  const handleChangeNroTarjeta = (e: ChangeEvent<HTMLInputElement>) => {
    setNroTarjeta(e.target.value);
  };
  const handleChangeCvv = (e: ChangeEvent<HTMLInputElement>) => {
    setNroTarjeta(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Usuario no autenticado");
      return;
    }
    const response = await axios.post("/api/transacciones", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "transaccion",
        monto: products.map((product:Product)=>product.price).reduce((total,current)=>total+current,0), 
        tipo: "compra", 
      }),
    });

    if (response.data.error) {
      setMessage(`Error: ${response.data.error}`);
    } else {
      setMessage("Transacción realizada exitosamente");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        required
        placeholder="NroTarjeta"
        onChange={handleChangeNroTarjeta}
      />
      <input
        type="password"
        required
        placeholder="cvv"
        onChange={handleChangeCvv}
      />
      <button type="submit">Pagar</button>
    </form>
  );
}

export default PayForm;
