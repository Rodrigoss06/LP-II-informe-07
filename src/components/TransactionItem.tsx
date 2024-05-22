import { Transaccion } from "@/types";
import React, { useState } from "react";

function TransactionItem({ transaccion }: { transaccion: Transaccion }) {
  const [visibleTransacciones, setVisibleTransacciones] = useState(2);
  return (
    <article
      key={transaccion.usuario_id}
      className="bg-gray-100 p-4 w-96 ml-3 mt-3 rounded-lg shadow"
    >
      <p className="text-lg font-medium">{transaccion.nombre}</p>
      <p className="text-gray-800 font-bold">{transaccion.fecha.slice(0,10)}</p>

      <p className="text-gray-600">{transaccion.tipo}</p>
      <p className="text-gray-800 font-bold">{transaccion.monto}</p>
      <div className="mt-3 space-y-2">
        {transaccion.detalles
          .slice(0, visibleTransacciones)
          .map((producto, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-inner">
              <p className="text-gray-800">{producto.name}</p>
              <p className="text-gray-600">{producto.category}</p>
              <p className="text-gray-800 font-medium">{producto.precio}</p>
            </div>
          ))}
        {transaccion.detalles.length > visibleTransacciones && (
          <div className="bg-white p-3 rounded-lg shadow-inner">
            <button
              className=" rounded  mt-2 p-2 w-full bg-slate-500 text-white"
              onClick={() => setVisibleTransacciones(visibleTransacciones + 10)}
            >
              Mostrar Más
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default TransactionItem;
