/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './Pages/Home'
import Users from './Pages/Users'
import {Toaster} from "react-hot-toast"
function App() {
  return (
    <>
    <BrowserRouter>
    <Toaster position='top-center' reverseOrder={false}>
        </Toaster>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route index element={<Users/>}/> 
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
