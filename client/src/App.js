import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import LoginRoutes from './routes/LoginRoutes'
import LoginProvider from './utils/LoginProvider'
import './style/style.css'
import { isLoggedIn } from './auth/authHelperFunctions'
import { LoggedInUserRoutes } from './routes/LoggedInUserRoutes'

function App() {
  const [login, setLogin] = useState(false)
  return (
    <LoginProvider loginState={[login, setLogin]}>
      {isLoggedIn() ? <LoggedInUserRoutes /> : <LoginRoutes />}
      <ToastContainer />
    </LoginProvider>
  )
}

export default App