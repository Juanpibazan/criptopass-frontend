import React, {useState} from 'react';
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

    const handleActivePage = ()=>{
        const substr = activePage.substring(activePage.lastIndexOf('/'),activePage.length);
        console.log(substr);
        return substr;
    };

    const logOut = ()=>{
        dispatch({
            type:actionTypes.SET_USER,
            user:null
        });
        localStorage.removeItem('user');
    };

    const handleNavigate = (endpoint) =>{
        return navigate(endpoint);
    };
    

    return (
        <nav className='flex flex-row justify-between items-center py-4 navbar'>
            <div className='w-[150px] h-[150px]'>
                <img src={CriptopassLogo} />
            </div>
            <h1 className='font-bold text-[30px] text-primary'>{activeTitle}</h1>
            {user ? (
                <div className='w-[30%] flex flex-row justify-evenly items-center'>
                    <div className='w-[70%] flex flex-row justify-between items-center'>
                        <button className='py-2 px-4 bg-primary text-white border-primary border-2 rounded-md hover:bg-white hover:text-primary'>Transferir USDT a USD</button>
                        <button className='py-2 px-4 bg-white text-secondary border-secondary border-2 rounded-md hover:bg-secondary hover:text-white'>Registrar Destinatario</button>
                    </div>
                    <div className='w-[20%] flex flex-col justify-start items-end'>
                        <div className='text-center profile-icon-container'>
                            <RxAvatar className='text-[30px] text-secondary' />
                        </div>
                        <ul className='absolute pt-8 profile-icon-submenu'>
                            <li className='border-b-2 border-primary py-2'><Link>Mi Perfil</Link></li>
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