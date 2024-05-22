import React, { useEffect, useState } from 'react'
import * as data from "../../data.json";
import ProductItem from './ProductItem';
import type { Product } from '@/types';
import axios from 'axios';


function Products() {
    const [products,setProducts] = useState([])
    useEffect(()=>{
      const getProducts=async()=>{
        try {
        const response = await axios.get("https://fakestoreapi.com/products?limit=100")
        console.log(response.data)
        if (response.data) {
          setProducts(response.data)
        }
        } catch (error) {
          alert(error)
        }
      }
      getProducts()
    },[])
  return (
    <section className='flex flex-wrap mt-10'>
        {products.map((product:Product)=>(
            <ProductItem product={product}/>
        ))}
    </section>
  )
}

export default Products