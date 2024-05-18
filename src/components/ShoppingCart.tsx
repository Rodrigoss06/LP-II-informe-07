import { useModalBorrar, useProductsStore } from '@/UserStore'
import { Product } from '@/types'
import React from 'react'

function ShoppingCart() {
    const {products} = useProductsStore((state)=>state)
    const {setShowModalCart,setShowModalPay} = useModalBorrar((state)=>state)

    const handleClick =()=>{
        setShowModalCart(false)
        setShowModalPay(true)
    }
  return (
    <section>
        {
            products.map((product:Product)=>(
                <article key={product.id} className=' p-1 my-1 border border-white'>
                    <h1>{product.name}</h1>
                    <p>{product.price}</p>
                </article>
            ))
        }
        <button onClick={handleClick}>Pagar</button>
    </section>
  )
}

export default ShoppingCart