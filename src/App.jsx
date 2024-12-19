import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';

import Header from './Components/Header';
import Footer from './Components/Footer';
import TransferSection from './sections/TransferSection';
import SideBar from './sections/SideBar';
import Login from './sections/Login';
import Register from './sections/Register';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App app-grid-container'>
      <Header />
      <SideBar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/header' element={<Header />} />
        <Route path='/transfer' element={<TransferSection />} />
      </Routes>
      <Footer />

    </div>
  )
}

export default App
