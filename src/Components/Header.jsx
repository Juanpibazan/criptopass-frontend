import React, {useState,useEffect} from 'react';
import {RxAvatar} from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';

import BinanceLogo from '../img/binance.png';
import CriptopassLogo from '../img/criptopass.svg';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const Header = ()=>{
    const navigate = useNavigate();
    const [activePage,setActivePage] = useState(window.location.href);
    const [{activeTitle,user},dispatch] = useStateValue();

    const [activeTab,setActiveTab] = useState('');


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

    const logOut = ()=>{
        dispatch({
            type:actionTypes.SET_USER,
            user:null
        });
        dispatch({
            type: actionTypes.SET_JWT,
            jwtoken: null
        });
        localStorage.removeItem('user');
        localStorage.removeItem('jwtoken');
        setTimeout(()=>navigate('/login'),500);
    };

    const handleNavigate = (endpoint) =>{
        return navigate(endpoint);
    };
    
    useEffect(()=>{
        console.log(activeTab);
        dispatch({
            type: actionTypes.SET_ACTIVE_TITLE,
            activeTitle: activeTab
        });
        localStorage.setItem('activeTitle',activeTab);
    },[]);
    

    return (
        <nav className='flex flex-row justify-between items-center py-4 navbar'>
            <div className='w-[150px] h-[150px]'>
                <img src={CriptopassLogo} />
            </div>
            <h1 className='font-bold text-[30px] text-primary'>{activeTitle}</h1>
            {user ? (
                <div className='w-[30%] flex flex-row justify-evenly items-center'>
                    {user.customer_id !=='' && user.kyc_status ==='approved' && (
                        <div className='w-[80%] flex flex-row justify-between items-center'>
                            <Link onClick={(e)=>handleClick(e.target.innerHTML)} to='/transfer' className='py-2 px-4 bg-primary text-white border-primary border-2 rounded-md hover:bg-white hover:text-primary'>Transferir USDT a USD</Link>
                            <button className='py-2 px-4 bg-white text-secondary border-secondary border-2 rounded-md hover:bg-secondary hover:text-white'>Registrar Cuenta Destino</button>
                        </div>
                    )}

                    <div className='w-[20%] flex flex-col justify-start items-end'>
                        <div className='text-center profile-icon-container'>
                            <RxAvatar className='text-[30px] text-secondary' />
                        </div>
                        <ul className='absolute pt-8 profile-icon-submenu'>
                            <li className='border-b-2 border-primary py-2'><Link onClick={(e)=>handleClick(e.target.innerHTML)} to='/profile'>Mi Perfil</Link></li>
                            <li className='border-b-2 border-primary py-2'><Link >Mis Destinatarios</Link></li>
                            <li className='border-b-2 border-primary py-2'><Link onClick={logOut}>Cerrar sesión</Link></li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className='w-[30%] flex flex-row justify-evenly items-center'>
                    <Link to='/login'
                    className='py-2 px-4 bg-primary text-white border-primary border-2 rounded-md hover:bg-white hover:text-primary'
                    >Iniciar Sesión</Link>
                    <Link to='/register'
                    className='py-2 px-4 bg-white text-secondary border-secondary border-2 rounded-md hover:bg-secondary hover:text-white'
                    >Registrarse</Link>
                </div>
            )}
        </nav>
    )
};

export default Header;