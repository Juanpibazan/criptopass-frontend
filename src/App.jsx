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
import Transfers from './sections/Transfers';
import Home from './sections/Home';
import Profile from './sections/Profile';
import RegistroDestinatarios from './sections/RegistroDestinatarios';
import RegistroCuentaExterna from './sections/RegistroCuentaExterna';
import P2PBinanceData from './sections/P2PBinanceData';

import { useStateValue } from './context/StateProvider';
import { actionTypes } from './context/reducer';

function App() {
  const [count, setCount] = useState(0);
  const [{user},dispatch] = useStateValue();
  const [isMobile,setIsMobile] = useState(false);


  return (
    <div className='App app-grid-container'>
      <Header />
      <SideBar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/header' element={<Header />} />
        <Route path='/transfers' element={<Transfers />} />
        <Route path='/transfer' element={<TransferSection />} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/register-recipient-accounts' element={<RegistroDestinatarios />} />
        <Route path='/register-external-account' element={<RegistroCuentaExterna/>} />
        <Route path='/p2p-binance' element={<P2PBinanceData />} />
      </Routes>
      <Footer />

    </div>
  )
}

export default App
