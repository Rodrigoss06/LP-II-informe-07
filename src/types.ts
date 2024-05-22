export interface UserRegister {
    nombre: string
    correo: string
    password: string
}

export interface UserLogin {
    correo: string
    password: string
}
  
export interface User {
    nombre: string
    correo: string
    encriptado: boolean
    password: string
    id: number
  }
  
  export interface Transaccion {
    usuario_id: number
    nombre:string
    monto: number
    tipo: string
    detalles: Detalle[]
    token_tarjeta: string
    fecha: string
  }
  
  export interface Detalle {
    name: string
    precio: number
    category: string
  }
  
  export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: Rating
  }
  
  export interface Rating {
    rate: number
    count: number
  }
  