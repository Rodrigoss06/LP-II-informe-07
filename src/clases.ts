// models/Cliente.ts

import crypto from 'crypto';
import bcrypt from "bcrypt";
import db from './db';
export class Cliente {
  protected nombre: string;
  protected correo: string;
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly key = crypto.randomBytes(32);
  private static readonly iv = crypto.randomBytes(16);

  constructor(nombre: string, correo: string) {
      this.nombre = nombre;
      this.correo = correo;
  }

  protected static encriptarInformacion(informacion: string): string {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encriptado = cipher.update(informacion, 'utf8', 'hex');
      encriptado += cipher.final('hex');
      return encriptado;
  }

  protected static desencriptarInformacion(encriptado: string): string {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
      let desencriptado = decipher.update(encriptado, 'hex', 'utf8');
      desencriptado += decipher.final('utf8');
      return desencriptado;
  }
}

export class ClienteSeguro extends Cliente {
  private id?: number;
  private password: string;
  private encriptado: boolean = false;

  constructor(nombre: string, correo: string, password: string, id?: number) {
    super(nombre, correo);
    this.password = password;
    this.id = id;
  }

  async encriptarPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    this.encriptado = true;
    } catch (error) {
      console.log(error)
    }
  }

  async verificarPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async guardarEnBaseDeDatos(): Promise<void> {
    try {
      const result = await db.one(
        'INSERT INTO usuarios (nombre, correo, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [this.nombre, this.correo, this.password]
      );
      this.id = result.id;
    } catch (error) {
      console.log(error)
    }
  }

  static async obtenerUsuarioPorCorreo(correo: string): Promise<ClienteSeguro | null> {
    try {
      const result = await db.oneOrNone('SELECT * FROM usuarios WHERE correo = $1', [correo]);
      if (result) {
        return new ClienteSeguro(result.nombre, result.correo, result.password_hash, result.id);
      }
      return null;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async realizarTransaccion(monto: number, tipo: string): Promise<void> {
    if (!this.id) throw new Error('Usuario no guardado en la base de datos');
    await db.none(
      'INSERT INTO transacciones (usuario_id, monto, tipo) VALUES ($1, $2, $3)',
      [this.id, monto, tipo]
    );
  }

  static async obtenerTransacciones(usuarioId: number): Promise<any[]> {
    const result = await db.any('SELECT * FROM transacciones WHERE usuario_id = $1', [usuarioId]);
    return result;
  }

  getNombre(): string {
    return this.nombre;
  }

  getId(): number {
    return this.id!;
  }
}
