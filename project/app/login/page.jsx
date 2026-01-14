"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [data, setData] = useState([])

 const fetchData = async () => {
  try {
    const res = await axios.get('https://api.escuelajs.co/api/v1/products/')
    setData(res.data)
  } catch (error) {
    console.error('Failed to fetch carts:', error)
    setData([])
  }
 }





return (<>
 
  <button onClick={fetchData} className='bg-green-500 w-20 m-10'>click</button>
  
     <div >{data.map((item ) => (
      <div key={item.id} className="bg-gray-600 p-4 my-2 ">
        <div>{item?.category?.id}</div>

        <div className='px-5 bg-green-400 m-5 w-80'>{item.title}</div>
        <img  src={item.images} alt="" className='w-50 h-50' />
        <div className='m-2'>{item.category?.name}</div>
        
      </div>
    ))}
  </div>
  </>
)
}

export default Page