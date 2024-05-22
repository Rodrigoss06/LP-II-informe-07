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
      console.error('Error al encriptar la contraseña:', error);
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
      console.error('Error al guardar en la base de datos:', error);
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
      console.error('Error al obtener usuario por correo:', error);
      return null;
    }
  }
  static async obtenerUsuarioPorId(id: number): Promise<ClienteSeguro | null> {
    try {
      const result = await db.oneOrNone('SELECT * FROM usuarios WHERE id = $1', [id]);
      if (result) {
        return new ClienteSeguro(result.nombre,result.correo, result.password_hash,result.id, );
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario por id:', error);
      return null;
    }
  }

  async realizarTransaccion(monto: number, tipo: string, detalles: any, tokenTarjeta: string,nombre:string): Promise<void> {
    if (!this.id) throw new Error('Usuario no guardado en la base de datos');
    try {
      const transaccion = new Transaccion(this.id, monto, tipo, detalles, tokenTarjeta,nombre);
      await transaccion.guardarEnBaseDeDatos();
    } catch (error) {
      console.error('Error al realizar transacción:', error);
    }
  }

  static async obtenerTransacciones(usuarioId: number): Promise<Transaccion[]> {
    try {
      return await Transaccion.obtenerTransaccionesPorUsuario(usuarioId);
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return [];
    }
  }

  getNombre(): string {
    return this.nombre;
  }

  getId(): number {
    return this.id!;
  }
  
  getCorreo(): string {
    return this.correo!;
  }
}

export class Transaccion {
  private id?: number;
  private usuario_id: number;
  private monto: number;
  private tipo: string;
  private detalles: any;
  private token_tarjeta: string;
  private nombre: string; // Añadido
  private fecha?: string

  constructor(usuario_id: number, monto: number, tipo: string, detalles: any, token_tarjeta: string, nombre: string,fecha?:string) {
    this.usuario_id = usuario_id;
    this.monto = monto;
    this.tipo = tipo;
    this.detalles = detalles;
    this.token_tarjeta = token_tarjeta;
    this.nombre = nombre; // Añadido
    if (fecha) {
      this.fecha = fecha
    }
  }

  
  async guardarEnBaseDeDatos(): Promise<void> {
    const result = await db.one(
      'INSERT INTO transacciones (usuario_id, monto, tipo, detalles, token_tarjeta, nombre_tarjeta) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [this.usuario_id, this.monto, this.tipo, this.detalles, this.token_tarjeta, this.nombre] // Modificado
    );
    this.id = result.id;
  }

  static async obtenerTransaccionesPorUsuario(usuario_id: number): Promise<Transaccion[]> {
    const result = await db.any('SELECT * FROM transacciones WHERE usuario_id = $1', [usuario_id]);
    return result.map((row: any) => new Transaccion(row.usuario_id, row.monto, row.tipo, row.detalles, row.token_tarjeta, row.nombre, row.created_at)); // Modificado
  }
}
