import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const SessionEnded = ()=>{
  
    return (
        <div>
            <div className='w-full min-h-screen flex flex-col justify-center items-center gap-4'>
                <h1 className='text-[30px] text-primary font-openSauce font-bold'>La sesión finalizó</h1>
                <Link to='/login'>Iniciar sesión</Link>
            </div>
        </div>
    )
};

export default SessionEnded;