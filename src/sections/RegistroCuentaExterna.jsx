import React, {useState} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';


const RegistroCuentaExterna = ()=>{

    const [{activeTitle,user,jwtoken},dispatch] = useStateValue();
    const [bankName,setBankName] = useState('');
    const [accountNumber,setAccountNumber] = useState();
    const [routingNumber,setRoutingNumber] = useState();
    const [accountType,setAccounttype] = useState('');
    const [accountOwnerName,setAccountOwnerName] = useState('');
    const [address,setAddress] = useState({
        street_line_1:'',
        street_line_2:'',
        city:'',
        state:'',
        postal_code:'',
        country:''
    });


    return (
        <div>
            <div className='flex flex-col justify-start items-start gap-4'>
                <div className='w-[50%]'>
                    <label>Nombre del Banco</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Lead Bank' />
                </div>
                <div className='w-[50%]'>
                    <label>Número de Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='210535431174' />
                </div>
                <div className='w-[50%]'>
                    <label>Número de Routing</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='204318456' />
                </div>
                <div className='w-[50%]'>
                    <label>Tipo de Cuenta</label><br/>
                    <select className='w-full border-2 border-secondary rounded-sm'>
                        <option className='bg-slate-200' value=''>Selecciona una opción</option>
                        <option className='bg-secondary' value='Checking'>Cuenta de Cheques</option>
                        <option className='bg-secondary' value='Saving'>Cuenta de Ahorros</option>
                    </select>
                </div>
                <div className='w-[50%]'>
                    <label>Nombre del Dueño de la Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei' />
                </div>
                <div className='w-full'>
                    <h3>Dirección</h3>
                    <div className='w-full flex flex-row justify-start items-center gap-4 flex-wrap'>
                        <div className='w-[50%]'>
                            <label>Nombre del Dueño de la Cuenta</label><br/>
                            <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei' />
                        </div>
                        <div className='w-[50%]'>
                            <label>Nombre del Dueño de la Cuenta</label><br/>
                            <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei' />
                        </div>
                        <div>
                            <label>Nombre del Dueño de la Cuenta</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei' />
                        </div>
                        <div>
                            <label>Nombre del Dueño de la Cuenta</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RegistroCuentaExterna;