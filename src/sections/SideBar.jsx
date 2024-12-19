import React, {useState,useEffect, useRef} from 'react';
import {FaBell, FaWallet} from 'react-icons/fa';
import {SiTether} from 'react-icons/si';
import {BiTransfer} from 'react-icons/bi';
import {TbCheckupList} from 'react-icons/tb';
import { Link } from 'react-router-dom';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';


const SideBar = ()=>{

    const [activeTab,setActiveTab] = useState('Bienvenido/a');
    const transferRef = useRef();
    const [{activeTitle},dispatch] = useStateValue();

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
                activeTitle: 'Bienvenido/a'
            });
            localStorage.setItem('activeTitle','Bienvenido/a');
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

    return (
        <div className='sidebar'>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <FaBell />
                Notificaciones
            </Link>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <FaWallet />
                Billeteras Virtuales
            </Link>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <SiTether />
                Compra USDT
            </Link>
            <Link to='/transfer' className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)} ref={transferRef}
            >
                <BiTransfer />
                Transferencias
            </Link>
            <Link className='flex justify-start items-center gap-2 py-4 text-primary font-bold text-[20px]'
            onClick={(e)=>handleClick(e.target.innerHTML)}>
                <TbCheckupList />
                Aprende Cripto
            </Link>
        </div>
    )
};

export default SideBar;