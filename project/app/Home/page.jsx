"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    const res = await axios.get('https://fakestoreapi.com/products')
    setData(res.data)
    console.log(data)

  };
  useEffect(() => {
    fetchData()
  }, [])
  const [click,setclick]=useState("")
  const getclick = async()=>{
    const ram = await axios.get('https://fakestoreapi.com/products')
    setclick(ram.click)
    console.log(click)

  }
  return (<>

    <div className=' bg-blue-600 '>
      {data.map((item, id) => {
        return <div key={id} className='bg-gray-500 text-black item-ceter w-fixed px-7 py-5 mb-3  '>
          <div className='bg-gray-400 rounded-xl h-10 p-2 text-center w-150'>{item.title}</div>
          <div onClick={getclick} className='p-5' ><img className='h-40 text-center' src={item.image} alt="" /></div>

          <div className='-p-2 m-4 bg-blue-500 w-30 text-center rounded-xl'>
           {item.price}$
          </div>
          <div className='bg-green-500 text-center w-40 rounded-xl'>{item.category}</div>
          <div className='bg-pink-300 w-120'> {item.description}</div>
        </div>
      })}
    </div>
  </>
  )
}

export default page
