import React from 'react'
import Navbar from '../components/navbar/Navbar'

const LoggedInLayout = ({children}) => {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}

export default LoggedInLayout