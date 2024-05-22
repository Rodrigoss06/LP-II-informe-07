import Logo from "@/icons/Logo";
import React, { useEffect, useState } from "react";
import Search from "./Search";
import LoginModal from "../Modals/LoginModal";
import LoginRegisterForm from "../LoginRegisterForm";
import { useModalBorrar, useUserStore } from "@/UserStore";
import ShoppingCartModal from "../Modals/ShoppingCartModal";
import ShoppingCart from "../ShoppingCart";
import PayModal from "../Modals/PayModal";
import PayForm from "../PayForm";
import UserModal from "../Modals/UserModal";
import UserData from "../User";
import { cookies } from "next/headers";
import { getCookie } from "@/authUtils";

function UserIcon({className}:{className?:string}) {
  return (
      <svg  className={className}   viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
  )
}

function Navbar() {
  const {showModalCart,showModalPay, showModalLogin, showModalUser ,setShowModalCart,setShowModalPay,setShowModalLogin, setShowModalUser} = useModalBorrar((state)=>state)

  const {loggin} = useUserStore((state)=>state)

  useEffect(()=>{
    if (loggin) {
      setShowModalLogin(false)
    }
  },[loggin])

  const {user_id, setLoggin,setUser_id} = useUserStore((state)=>state)
  useEffect(()=>{
    const token = getCookie("token")
    if (token) {
      setLoggin(token)
      setUser_id(token)
    }
  },[])
  
  return (
    <section className="grid grid-cols-[minmax(30px,_1fr)_minmax(220px,_7fr)_minmax(40px,_2fr)_minmax(30px,_1fr)] mx-8 py-2 border rounded my-2 px-1">
      <a href="/"><Logo className="flex justify-start size-7 items-center" /></a>
      <Search className="flex justify-center" />
      <div className="flex justify-around">
        {!loggin && (<button onClick={()=>setShowModalLogin(!showModalLogin)}>
          INICIAR SESIÓN O REGÍSTRATE
        </button>)}
        {loggin && (<button onClick={()=>setShowModalCart(!showModalCart)}>CARRITO</button>)}
      </div>
      <div className="flex justify-end items-center">
      {loggin && (<a href={`http://localhost:3000/user/${user_id}`} onClick={()=>setShowModalUser(!showModalUser)}>
          <UserIcon className="size-7 border border-white rounded-full "/>
        </a>)}
      </div>
      <LoginModal show={showModalLogin} onClose={()=>setShowModalLogin(!showModalLogin)}>
        <LoginRegisterForm/>
      </LoginModal>
      <ShoppingCartModal show={showModalCart} onClose={()=>setShowModalCart(!showModalCart)}>
        <ShoppingCart/>
      </ShoppingCartModal>
      <PayModal show={showModalPay} onClose={()=>setShowModalPay(!showModalPay)}>
        <PayForm/>
      </PayModal>

    </section>
  );
}

export default Navbar;
