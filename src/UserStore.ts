import { create } from "zustand"; 
import { Product } from "./types";
import { getUserIdFromToken } from "./authUtils";


interface StoreUser {
    loggin: boolean,
    user_id:number,
    setLoggin:(loggin:string)=>void,
    setUser_id:(user_id:string)=>void
}
export const useUserStore= create<StoreUser>((set) =>({
    loggin: false,
    user_id: 0,
    setLoggin:(token:string)=>{
        if (token) {
            const user_id = getUserIdFromToken(token)
            if (user_id) {
                set({loggin:true})
                return
            }
        }
        return
    },
    setUser_id:(token:string)=>{
        if (token) {
            const user_id = getUserIdFromToken(token)
            if (user_id) {
                set({user_id})
                return
            }
        }
        return
    },
}))

interface StoreProducts {
    products: Product[],
    setProducts:(product:Product)=>void,
    emptyShoppingCart:()=>void
}
export const useProductsStore= create<StoreProducts>((set) =>({
    products: [],
    setProducts:(product:Product)=>set((state) => ({
        products: [...state.products, product]
    })),
    emptyShoppingCart: ()=>set({products:[]})
}))

interface ModalBorrar {
    showModalCart: boolean,
    showModalPay: boolean,
    showModalLogin: boolean,
    showModalUser: boolean,
    setShowModalCart:(showModalCart:boolean)=>void
    setShowModalPay:(showModalPay:boolean)=>void
    setShowModalLogin:(showModalLogin:boolean)=>void
    setShowModalUser:(showModalUser:boolean)=>void
}
export const useModalBorrar= create<ModalBorrar>((set) =>({
    showModalCart: false,
    showModalPay: false,
    showModalLogin: false,
    showModalUser: false,
    setShowModalCart:(showModalCart:boolean)=>set({showModalCart}),
    setShowModalPay:(showModalPay:boolean)=>set({showModalPay}),
    setShowModalLogin:(showModalLogin:boolean)=>set({showModalLogin}),
    setShowModalUser:(showModalUser:boolean)=>set({showModalUser}),

}))