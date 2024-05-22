import React, { ChangeEvent, useState } from "react";
import bcrypt from "bcryptjs";
import axios from "axios";
import { useProductsStore } from "@/UserStore";
import { Product } from "@/types";
import { getCookie } from "@/authUtils";

interface CardInfo {
  nroTarjeta: string;
  nombre: string;
  expiration_date: {
    month: string;
    year: string;
  };
}

async function tokenizeCard(cardInfo: CardInfo): Promise<string> {
  const { nroTarjeta } = cardInfo;

  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash the card data
  const hashedCardData = await bcrypt.hash(nroTarjeta, salt);

  return hashedCardData;
}
function PayForm() {
  const [nroTarjeta, setNroTarjeta] = useState("");
  const [nombre, setNombre] = useState("")
  const [expiration_date, setExpiration_date] = useState({
    month:"01",
    year: "2024"
  })
  const [cvv, setCvv] = useState("");
  const { products,emptyShoppingCart } = useProductsStore((state) => state);


  const handleChangeNroTarjeta = (e: ChangeEvent<HTMLInputElement>) => {
    setNroTarjeta(e.target.value);
  };
  const handleChangeNombre = (e:ChangeEvent<HTMLInputElement>)=>{
    setNombre(e.target.value)
  }
  const handleChangeExpirationDate = (e:ChangeEvent<HTMLSelectElement>)=>{
    if (e.target.name === "expiration_date_month") {
      setExpiration_date(prevState=>({
        ...prevState,
        month: e.target.value
      }))
    } else if (e.target.name==="expiration_date_year") {
      setExpiration_date(prevState=>({
        ...prevState,
        year: e.target.value
      }))
    }
  }
  const handleChangeCvv = (e: ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(1)
    const token = getCookie("token");
    console.log(2)
    if (!token) {
      console.log(3)
      alert("Usuario no autenticado");
      return;
    }

    let token_tarjeta;
    try {
      token_tarjeta = await tokenizeCard({
        nroTarjeta,
        nombre,
        expiration_date,
      });
    } catch (error) {
      console.log(2)
      alert("Error al tokenizar la tarjeta");
      return;
    }
    try {
      const response = await axios.post("/api/Transacciones", {
        typeOpr: "transaccion",
        monto: products
          .map((product: Product) => product.price)
          .reduce((total, current) => total + current, 0),
        tipo: "compra",
        detalles: products.map((product: Product) => ({
          name: product.title,
          category: product.category,
          precio: product.price,
        })),
        token_tarjeta,
        nombre,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.message) {
        alert(response.data.message);
        emptyShoppingCart()
      } else if (response.data.error) {
        alert(response.data.error);
      }

      setNroTarjeta("");
      setNombre("");
      setExpiration_date({ month: "01", year: "2024" });
      setCvv("");
    } catch (error) {
      alert("Error al procesar la transacción");
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      <label>
        Card number
        <input
          type="tel"
          required
          value={nroTarjeta}
          className="rounded p-1 text-black"
          onChange={handleChangeNroTarjeta}
        />
      </label>
      <label>
        Name on card
        <input
          type="text"
          required
          value={nombre}
          className="rounded p-1 text-black"
          onChange={handleChangeNombre}
        />
      </label>
      <label>
        Expiration date
        <div className="flex gap-x-6">
          <select name="expiration_date_month" className="text-black" onChange={handleChangeExpirationDate} value={expiration_date.month}>
            {Array.from({length:12},(_,i)=>i+1).map((month)=>(
              <option value={month}>{month}</option>
            ))}
          </select>
          <select name="expiration_date_year" className="text-black" onChange={handleChangeExpirationDate} value={expiration_date.year}>
            {Array.from({length:16},(_,i)=>2023+i+1).map((year)=>(
              <option value={year}>{year}</option>
            ))}
          </select>
        </div>
      </label>
      <label>
        Security Code(CVV)
        <input
          type="tel"
          required
          value={cvv}
          className="rounded p-1 text-black"
          onChange={handleChangeCvv}
        />
      </label>
      <button
        type="submit"
        className="flex justify-center text-xl font-semibold "
      >
        Pagar
      </button>
    </form>
  );
}

export default PayForm;
