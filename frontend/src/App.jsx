import React from 'react'
import Navbar from "./components/Navbar"
import ProductPage from "./pages/ProductPage"
import HomePage from "./pages/HomePage"
import { Routes, Route } from "react-router-dom"
import { useThemeStore } from './store/useThemeStore.js'
import { Toaster } from "react-hot-toast"

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme}>
      <div className='min-h-screen bg-base-200 transition-colors duration-300'>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/product/:id' element={<ProductPage />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  )
}

export default App