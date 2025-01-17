import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import { Link } from 'react-router-dom';

const Home = ()=>{

    const [isMobile,setIsMobile] = useState(false);

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
        <div>
            <div className='py-2 px-4'>
                <div>
                    <h2 className='font-openSauce text-[30px] text-primary'>Quieres transferir USDT y convertirlos en USD??</h2>
                    <h3 className='font-garet text-[20px] text-secondary'>Sigue estos pasos:</h3>
                </div>
                <div className='flex max-xl:flex-col justify-start items-center gap-5'>
                    <div className='py-2 px-4 max-sm:w-full min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>1</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Completa tu proceso KYC</h3>
                            <p className='font-garet text-white'>Cumple este paso esencial para desbloquear funcionalidades clave. Ve a <Link to='/profile' className='text-secondary font-bold hover:text-yellow-100'>"Mi Perfil"</Link> y selecciona "Comenzar proceso KYC".</p>
                        </div>
                    </div>
                    <div className='py-2 px-4 max-sm:w-full min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>2</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Agrega cuentas externas y facilita transferencias</h3>
                            <p className='font-garet text-white'>Una vez completado tu KYC, podrás vincular tu cuenta externa en USA para recibir USD. Si transfieres a alguien más, asegúrate de que el destinatario también esté registrado y haya seguido los mismos pasos.</p>
                        </div>
                    </div>
                    <div className='py-2 px-4 max-xl:w-full min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>3</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Realiza la transferencia</h3>
                            <p className='font-garet text-white'>Haz click en <strong>"{`${!isMobile ? "Transferir USDT a USD" : "USDT a USD"}`}"</strong>, proporciona algunos detalles y empezarás el proceso de transferencia.`}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};


export default Home;
