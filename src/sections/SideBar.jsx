import React, {useState,useEffect, useRef} from 'react';
import {FaBell, FaWallet, FaInfoCircle, FaHome} from 'react-icons/fa';
import {SiTether} from 'react-icons/si';
import {BiTransfer} from 'react-icons/bi';
import {TbCheckupList} from 'react-icons/tb';
import {GiHamburgerMenu} from 'react-icons/gi';
import { Link } from 'react-router-dom';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';


const SideBar = ()=>{
    const [{activeTitle,user},dispatch] = useStateValue();
    const [activeTab,setActiveTab] = useState(user ? 'Bienvenido/a': '');
    const [isMobile,setIsMobile] = useState(false);
    const [isMenuShowing, setIsMenuShowing] = useState(false);
    const transferRef = useRef();


    const handleClick = (text)=>{
        if(!text.includes('Bienvenido/a')){
            console.log(text.substring(text.lastIndexOf('>')+1,text.length));
            const substr = text.substring(text.lastIndexOf('>')+1,text.length)
            setActiveTab(substr);
            dispatch({
                type: actionTypes.SET_ACTIVE_TITLE,
                activeTitle: substr
            });
            localStorage.setItem('activeTitle',substr);
        } else{
            dispatch({
                type: actionTypes.SET_ACTIVE_TITLE,
                activeTitle: activeTab
            });
            localStorage.setItem('activeTitle',activeTab);
        }

    };


    useEffect(()=>{
        console.log(activeTab);
        dispatch({
            type: actionTypes.SET_ACTIVE_TITLE,
            activeTitle: activeTab
        });
        localStorage.setItem('activeTitle',activeTab);
    },[]);

    useEffect(()=>{
            const mediaQuery = window.matchMedia('(max-width : 850px)');
            setIsMobile(mediaQuery.matches);
        
            const handleMediaQueryChange = (event)=>{
              setIsMobile(event.matches);
            };
        
            mediaQuery.addEventListener('change', handleMediaQueryChange);
        
            return ()=>{
              mediaQuery.removeEventListener('change',handleMediaQueryChange);
            }
        
          },[]);

          const handleMenu = ()=>{
            if(isMobile){
                return setIsMenuShowing(!isMenuShowing);
            }

          };

    return (
        <div className='sidebar'>
            <div onClick={handleMenu}>
                <GiHamburgerMenu className={`${isMobile ? 'block' : 'hidden'} text-[30px]`} />
            </div>
        {user ? (
            <div className={`${(isMobile && isMenuShowing) ? 'block max-md:bg-secondary max-md:border-secondary max-md:border-2 max-md:shadow-md max-md:rounded-md font-openSauce max-md:w-[80%] max-md:absolute max-md:min-h-screen max-md:z-50' : (isMobile && !isMenuShowing) ? 'hidden' : 'max-md:bg-secondary max-md:border-secondary max-md:border-2 max-md:shadow-md max-md:rounded-md max-md:absolute font-openSauce max-md:w-[80%]'}`}>
            <Link to='/home' className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <FaHome />
                Home
            </Link>
            {/*<Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <FaBell />
                Notificaciones
            </Link>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <FaWallet />
                Billeteras Virtuales
            </Link>*/}
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            to='/p2p-binance'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <SiTether />
                Compra USDT <span className='text-[#f3ba2f] text-[15px]'>(Ofertas de Binance)</span>
            </Link>
            <Link to='/transfers' className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)} ref={transferRef}
            >
                <BiTransfer />
                Transferencias
            </Link>
            {/*<Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <TbCheckupList />
                Aprende Cripto
            </Link>*/}
        </div>
        ) : (
        <div className={`${(isMobile && isMenuShowing) ? 'block max-md:bg-secondary max-md:border-secondary max-md:border-2 max-md:shadow-md max-md:rounded-md font-openSauce max-md:w-[80%] max-md:absolute max-md:min-h-screen max-md:z-50' : (isMobile && !isMenuShowing) ? 'hidden' : 'max-md:bg-secondary max-md:border-secondary max-md:border-2 max-md:shadow-md max-md:rounded-md max-md:absolute font-openSauce max-md:w-[80%]'}`}>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <FaInfoCircle />
                Conócenos
            </Link>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <TbCheckupList />
                Aprende Cripto
            </Link>
        </div>
        )}
        </div>
    )
};

export default SideBar;