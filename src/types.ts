export interface UserRegister {
    nombre: string
    correo: string
    password: string
}

export interface UserLogin {
    correo: string
    password: string
}
  
export interface Product {
    id: number
    name: string
    category: string
    price: number
    stock: number
}