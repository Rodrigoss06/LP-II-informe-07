import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { ClienteSeguro } from '@/clases';

interface JwtPayload {
  user_id: number;
}

type Data = {
  error?: string;
  message?: string;
  transacciones?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { authorization } = req.headers;
  console.log(authorization)
  if (!authorization) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const token = authorization.split(' ')[1];
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log(decoded)
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  const { typeOpr, monto, tipo, detalles, token_tarjeta, nombre } = req.body;
  console.log(typeOpr)
  console.log(monto)
  console.log(tipo)
  console.log(detalles)
  console.log(token_tarjeta)
  console.log(nombre)
  if (typeof typeOpr !== 'string') {
    res.status(400).json({ error: 'Parámetros de consulta inválidos' });
    return;
  }

  const user = await ClienteSeguro.obtenerUsuarioPorId(decoded.user_id);
  console.log(user)
  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  if (typeOpr === 'transaccion') {
    if (typeof monto === 'number' && typeof tipo === 'string' && typeof token_tarjeta === 'string' && typeof nombre === 'string') {
      try {
        await user.realizarTransaccion(monto, tipo, JSON.stringify(detalles), token_tarjeta,nombre);
        res.status(200).json({ message: 'Transacción realizada exitosamente' });
      } catch (error) {
        console.error('Error al realizar la transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    } else {
      res.status(400).json({ error: 'Parámetros de transacción inválidos' });
    }
  } else if (typeOpr === 'obtener_transacciones') {
    try {
      const transacciones = await ClienteSeguro.obtenerTransacciones(user.getId());
      console.log(transacciones)
      res.status(200).json({ message: 'Transacciones obtenidas exitosamente', transacciones: JSON.stringify(transacciones) });
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(400).json({ error: 'Tipo de acción no soportado' });
  }
}
