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

function Navbar() {
  const [showModalLogin,setShowModalLogin] = useState(false)
  const {showModalCart,showModalPay,setShowModalCart,setShowModalPay} = useModalBorrar((state)=>state)

  const {loggin} = useUserStore((state)=>state)

  useEffect(()=>{
    if (loggin) {
      setShowModalLogin(false)
    }
  },[loggin])
  return (
    <section className="grid grid-cols-[minmax(30px,_1fr)_minmax(220px,_5fr)_minmax(40px,_3fr)] mx-2 py-4">
      <Logo className="flex justify-center" />
      <Search className="flex justify-center" />
      <div className="flex justify-around">
        {!loggin && (<button onClick={()=>setShowModalLogin(!showModalLogin)}>
          INICIAR SESIÓN O REGÍSTRATE
        </button>)}
        {loggin && (<button onClick={()=>setShowModalCart(!showModalCart)}>CARRITO</button>)}
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
