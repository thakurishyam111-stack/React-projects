import React, { Children } from 'react'
import { Provider } from 'react-redux'

const apollowprovider = () => {
  return (
    <Provider store={store} 
    > <Children/>
    
    apollowprovider</Provider>
  )
}

export default apollowprovider