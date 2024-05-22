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
                    <h1>{product.title}</h1>
                    <p>{product.price}</p>
                </article>
            ))
        }
        {products.length>=1? (<button className=' mt-3 py-1 px-3 rounded bg-[#666666] hover:bg-[#666666]/70' onClick={handleClick}>Pagar ahora</button>):(
            <p className='flex justify-center text-xl font-semibold'>Tu carrito esta vacío</p>
        )}
    </section>
  )
}

export default ShoppingCart