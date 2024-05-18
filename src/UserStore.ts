import { create } from "zustand"; 
import { Product } from "./types";


interface Store {
    loggin: boolean,
    user_id:string,
    setLoggin:(loggin:boolean)=>void,
    setUser_id:(user_id:string)=>void
}
export const useUserStore= create<Store>((set) =>({
    loggin: false,
    user_id: "0",
    setLoggin:(loggin:boolean)=>set({loggin}),
    setUser_id:(user_id:string)=>set({user_id})
}))

interface StoreProducts {
    products: Product[],
    setproducts:(product:Product)=>void
}
export const useProductsStore= create<StoreProducts>((set) =>({
    products: [],
    setproducts:(product:Product)=>set((state) => ({
        products: [...state.products, product]
    }))
}))

interface ModalBorrar {
    showModalCart: boolean,
    showModalPay: boolean,
    setShowModalCart:(showModalCart:boolean)=>void
    setShowModalPay:(showModalPay:boolean)=>void
}
export const useModalBorrar= create<ModalBorrar>((set) =>({
    showModalCart: false,
    showModalPay: false,
    setShowModalCart:(showModalCart:boolean)=>set({showModalCart}),
    setShowModalPay:(showModalPay:boolean)=>set({showModalPay})
}))