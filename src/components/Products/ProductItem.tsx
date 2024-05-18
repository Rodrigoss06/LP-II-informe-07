import { useProductsStore, useUserStore } from '@/UserStore'
import { Product } from '@/types'
import React from 'react'
interface Params {
    product: Product
}
function ProductItem({product}:Params) {
  const {setproducts} = useProductsStore((state)=>state)
  const {loggin} = useUserStore((state)=>state)

  const handleClick = ()=>{
    if (loggin) {
      setproducts(product)
    } else {
      alert("Debe Iniciar Sesión para poder comprar nuestro productos")
    }
    
  }
  return (
    <article className=' m-2 p-2 border border-white '>
        <h1 className='text-2xl'>{product.name}</h1>
        <p className='text-xs'>{product.category}</p>
        <p className='text-sm'>precio: {product.price}</p>
        <p className='text-sm'>stock: {product.stock}</p>
        <button className='p-1 mx-1 mt-2 mb-1 border border-white' onClick={handleClick}>Comprar</button>
    </article>
  )
}

export default ProductItem