import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import { Link } from 'react-router-dom';

const Home = ()=>{


    return (
        <div>
            <div className='py-2 px-4'>
                <div>
                    <h2 className='font-openSauce text-[30px] text-primary'>Quieres transferir USDT y convertirlos en USD??</h2>
                    <h3 className='font-garet text-[20px] text-secondary'>Sigue estos pasos:</h3>
                </div>
                <div className='flex max-sm:flex-col justify-start items-center flex-wrap gap-5'>
                    <div className='py-2 px-4 w-[30%] min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>1</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Completa la verificación KYC</h3>
                            <p className='font-garet text-white'>Necesitas completar este proceso para estar habilitado y poder realizar este tipo de transferencias. Ve a <Link to='/profile' className='text-secondary font-bold hover:text-yellow-100'>Mi Perfil</Link> y haz click en "Comenzar proceso KYC".</p>
                        </div>
                    </div>
                    <div className='py-2 px-4 w-[30%] min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>2</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Agrega tu cuenta destino</h3>
                            <p className='font-garet text-white'>Unz vez el KYC haya sido completado, podrás agregar tu propia cuenta destino en USA en la que quieres recibir USD. En caso de que quieras transferir a la cuenta de alguien más, mira el paso <strong>3</strong>.</p>
                        </div>
                    </div>
                    <div className='py-2 px-4 w-[30%] min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>3</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Tu destinatario/proveedor debe registrarse</h3>
                            <p className='font-garet text-white'>El destinatario debe registrarse y seguir todos los pasos anteriores.</p>
                        </div>
                    </div>
                    <div className='py-2 px-4 w-[30%] min-h-[200px] flex flex-row justify-start items-center gap-4 bg-primary border-3 border-secondary rounded-md shadow-md'>
                        <div>
                            <h1 className='text-secondary text-[30px] font-bold font-openSauce'>4</h1>
                        </div>
                        <div>
                            <h3 className='font-openSauce text-secondary font-extrabold text-[20px]'>Realiza la transferencia</h3>
                            <p className='font-garet text-white'>Haz click en "Transferir USDT a USD", proporciona algunos detalles y empezarás el proceso de transferencia.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};


export default Home;
