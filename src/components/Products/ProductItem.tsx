import { useProductsStore, useUserStore } from '@/UserStore'
import { Product } from '@/types'
import React from 'react'
interface Params {
    product: Product
}
function ProductItem({product}:Params) {
  const {setProducts} = useProductsStore((state)=>state)
  const {loggin} = useUserStore((state)=>state)

  const handleClick = ()=>{
    if (loggin) {
      setProducts(product)
    } else {
      alert("Debe Iniciar Sesión para poder comprar nuestro productos")
    }
    
  }
  return (
    <article className="w-[250px] m-2 p-2 border border-white flex flex-col overflow-hidden">
  <h1 className="text-2xl overflow-hidden w-[250px] h-12 text-ellipsis whitespace-nowrap">{product.title}</h1>
  <p className="text-xs">{product.category}</p>
  <img className="w-56 h-56 object-cover" src={product.image} alt={product.title} />
  <p className="text-sm">Precio: {product.price}</p>
  <button className="p-1 mx-1 mt-2 mb-1 bg-zinc-800" onClick={handleClick}>
    Comprar
  </button>
</article>


  )
}

export default ProductItem