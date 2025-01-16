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
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


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
    

    return (
        <nav className='flex flex-row justify-between items-center py-4 navbar'>
            <div className='w-[50%] flex flex-row justify-between items-center'>
            <div className='w-[100px] h-[100px]'>
                <img src={CriptopassLogo} />
            </div>
            {/*<h1 className={isMobile ? 'hidden' :'font-bold text-[30px] max-sm:text-[20px] text-primary'}>{activeTitle}</h1>*/}
            </div>
            {user ? (
                <div className='w-[50%] flex flex-row justify-evenly items-center gap-2'>
                    {user.customer_id !=='' && user.kyc_status ==='approved' && user.tos_status === 'approved' && (
                        <div className='w-[80%] flex flex-row justify-between items-center gap-1'>
                            <Link onClick={(e)=>handleClick(e.target.innerHTML)} to='/transfer' className='py-2 px-4 max-sm:px-2 max-sm:py-1 bg-primary text-white border-primary border-2 rounded-md hover:bg-white hover:text-primary max-sm:text-[15px]'>{isMobile ? 'USDT a USD' : 'Transferir USDT a USD'}</Link>
                            <Link onClick={(e)=>handleClick(e.target.innerHTML)} to='/register-external-account' className='py-2 px-4 max-sm:px-2 max-sm:py-1 bg-white text-secondary border-secondary border-2 rounded-md hover:bg-secondary hover:text-white max-sm:text-[15px]'>{isMobile ? 'Crear Cuenta Ext.' : 'Registrar Una Cuenta Externa'}</Link>
                        </div>
                    )}

                    <div className='w-[20%] flex flex-col justify-start items-end'>
                        <div className='text-center profile-icon-container flex flex-col gap-2 justify-start items-center'
                        onClick={()=>setIsOpen(!isOpen)}>
                            <RxAvatar className='text-[40px] text-secondary' />
                            <p className='text-secondary max-sm:text-[15px] font-bold'>Mi CriptoPass</p>
                        </div>
                        <ul className={`${isOpen ? 'absolute pt-8 bg-secondary border-2 border-secondary rounded-md shadow-md top-[90px] px-2 pb-2' : 'hidden absolute pt-8 bg-secondary border-2 border-secondary rounded-md shadow-md top-[90px]'}`}>
                            <li className='border-b-2 border-primary py-2'><Link onClick={(e)=>handleClick(e.target.innerHTML)} to='/profile' className='hover:text-white active:text-white font-garet font-bold'>Mi Perfil</Link></li>
                            <li className='border-b-2 border-primary py-2'><Link to='/register-recipient-accounts' className='hover:text-white active:text-white font-garet font-bold'>Mis Destinatarios</Link></li>
                            <li className='border-b-2 border-primary py-2'><Link onClick={logOut} className='hover:text-white active:text-white font-garet font-bold'>Cerrar sesión</Link></li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className='w-[50%] flex flex-row justify-evenly items-center gap-2'>
                    <Link to='/login'
                    className='py-2 px-4 max-sm:px-2 max-sm:py-1 bg-primary text-white border-primary border-2 rounded-md hover:bg-white hover:text-primary'
                    >Iniciar Sesión</Link>
                    <Link to='/register'
                    className='py-2 px-4 max-sm:px-2 max-sm:py-1 bg-white text-secondary border-secondary border-2 rounded-md hover:bg-secondary hover:text-white'
                    >Registrarse</Link>
                </div>
            )}
        </nav>
    )
};

export default Header;