'use client'
import axios from 'axios'
import React, { useState } from 'react'

const page = () => {
  const [user, setUser] = useState([])

  const product = async () => {
    try {
      const res = await axios.get(' https://api.escuelajs.co/api/v1/users/3')
      setUser([res.data])
    } catch (error) {
      console.error(error)
    }
  }


  return (<>
  
  <button onClick={product} className='bg-blue-600 m-5 rounded-xl h-8 px-3'>Fetch user</button>
  <div> 
    {user.length === 0 ? (
      <p>No user</p>
    ) : (
      user.map((item) => (
        <div key={item.id}>
          <p> user id:{item.id}</p>
          <p> E-mail:{item.email}</p>
          <p> password:{item.password}</p>
          <p> userName:{item.name}</p>
<img src={item.avatar} alt="photo" />
        </div>
      ))
    )}
  </div>
  </>
  )
}

export default page