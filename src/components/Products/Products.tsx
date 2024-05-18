import React from 'react'
import * as data from "../../data.json";
import ProductItem from './ProductItem';
import type { Product } from '@/types';


function Products() {
    const products: Product[] = data.map((product:Product)=> product)
  return (
    <section className='flex flex-wrap mt-10'>
        {products.map((product:Product)=>(
            <ProductItem product={product}/>
        ))}
    </section>
  )
}

export default Products