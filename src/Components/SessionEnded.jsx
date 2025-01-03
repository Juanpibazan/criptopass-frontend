import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
const SessionEnded = ()=>{
    const [{user,jwtoken},dispatch] = useStateValue();

    const handleClick = ()=>{
        dispatch({
            type:actionTypes.SET_USER,
            user: null
        });
        dispatch({
            type:actionTypes.SET_JWT,
            jwtoken: null
        });
        localStorage.removeItem('user');
        localStorage.removeItem('jwtoken');
    };
  
    return (
        <div>
            <div className='w-full min-h-screen flex flex-col justify-center items-center gap-4'>
                <h1 className='text-[30px] text-primary font-openSauce font-bold'>La sesión finalizó</h1>
                <Link onClick={()=>handleClick()} to='/login'
                className='bg-secondary text-white font-garet border-2 border-secondary rounded-md py-2 px-4'
                >Iniciar sesión</Link>
            </div>
        </div>
    )
};

export default SessionEnded;