import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { ClienteSeguro } from '@/clases';
interface JwtPayload {
  email: string;
}
type Data = {
  error?: string;
  message?: string;
  transacciones?: any[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const token = authorization.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  const { type, monto, tipo }: { type?: string; monto?: number; tipo?: string } = req.body;

  if (typeof type !== 'string') {
    res.status(400).json({ error: 'Parámetros de consulta inválidos' });
    return;
  }

  if (type === 'transaccion') {
    const user = await ClienteSeguro.obtenerUsuarioPorCorreo(decoded.email);

    if (user) {
      if (typeof monto === 'number' && typeof tipo === 'string') {
        await user.realizarTransaccion(monto, tipo);
        res.status(200).json({ message: 'Transacción realizada exitosamente' });
      } else {
        res.status(400).json({ error: 'Parámetros de transacción inválidos' });
      }
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } else if (type === 'obtener_transacciones') {
    const user = await ClienteSeguro.obtenerUsuarioPorCorreo(decoded.email);

    if (user) {
      const transacciones = await ClienteSeguro.obtenerTransacciones(user.getId());
      res.status(200).json({ message: 'Transacciones obtenidas exitosamente', transacciones });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } else {
    res.status(400).json({ error: 'Tipo de acción no soportado' });
  }
}
