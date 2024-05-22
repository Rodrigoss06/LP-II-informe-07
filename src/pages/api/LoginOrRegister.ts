import { ClienteSeguro } from "@/clases";
import { UserLogin, UserRegister } from "@/types";
import type { NextApiRequest, NextApiResponse, GetServerSideProps } from "next";
import jwt from 'jsonwebtoken';
import cookie from "cookie";
type Params = {
  type?: string;
  userDataString?: string;
};

type Data = {
  error?: string;
  message?: string;
  authenticated?: boolean;
  token?:string;
  user_id?:number
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type, userDataString }: Params = req.query as unknown as Params;
  const userData: UserLogin | UserRegister = JSON.parse(userDataString!);
  
  if (typeof type !== "string" || typeof userData === "undefined") {
    res.status(400).json({ error: "Parámetros de consulta inválidos" });
    return;
  }

  try {
    if (type === "login") {
      const { correo, password } = userData as UserLogin;
      console.log(correo)
      console.log(password)
      const user = await ClienteSeguro.obtenerUsuarioPorCorreo(correo);
      console.log(user)
      
      if (user) {
        const isAuthenticated = await user.verificarPassword(password);
        console.log(isAuthenticated)
        if (isAuthenticated) {
          const token = jwt.sign({ user_id: user.getId() }, process.env.JWT_SECRET!, { expiresIn: '1h' });
          res.setHeader('Set-Cookie', cookie.serialize('token', token,{
            maxAge: 60*60,
            path: "/",
            secure: true
          }))
          console.log(token)
          res.status(200).json({ message: "Autenticación exitosa", authenticated: true, token, user_id:user.getId() });
        } else {
          res.status(401).json({ error: "Contraseña incorrecta" });
        }
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } else if (type === "crear_cuenta") {
      console.log(2)
      const { nombre, correo, password } = userData as UserRegister;
      console.log(nombre)
      console.log(correo)
      console.log(password)
      const existingUser = await ClienteSeguro.obtenerUsuarioPorCorreo(correo);
      console.log(existingUser)
      if (existingUser) {
        console.log(3)
        res.status(409).json({ error: "El usuario ya existe" });
      } else {
        console.log(4)
        const newUser = new ClienteSeguro(nombre, correo, password);
        await newUser.encriptarPassword();
        await newUser.guardarEnBaseDeDatos();
        const token = jwt.sign({ user_id: newUser.getId() }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(201).json({ message: "Cuenta creada exitosamente", authenticated: true, token, user_id:newUser.getId() });
      }
    } else {
      console.log(4)
      res.status(400).json({ error: "Tipo de acción no soportado" });
    }
  } catch (error) {
    console.log(5)
    console.log(error)
    res.status(500).json({ error: "Error del servidor" });
  }
}

