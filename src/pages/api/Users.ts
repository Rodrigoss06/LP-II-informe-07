import { ClienteSeguro } from "@/clases";
import type { NextApiRequest, NextApiResponse } from "next";

type Params = {
  user_id: string;
};

type Data = {
  error?: string;
  message?: string;
  user?: string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method ==="GET") {
        const { user_id }: Params = req.query as unknown as Params;
        console.log(user_id)
        if (typeof user_id !== "string" && Number(user_id)>0) {
            res.status(400).json({ error: "Parámetros de consulta inválidos" });
            return;
        }
        const existingUser = await ClienteSeguro.obtenerUsuarioPorId(Number(user_id));
        console.log(existingUser)
        if (existingUser) {
            console.log(3)
            res.status(200).json({ message: "Usuario encontrado", user:JSON.stringify(existingUser) });
          } else {
            res.status(409).json({ error: "El usuario no existe" });
          }
    }
}

