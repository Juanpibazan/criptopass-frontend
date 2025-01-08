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


    return (
        <div>
            <div>
                <div>
                    <label>Nombre del Banco</label><br/>
                    <input type='text' placeholder='Lead Bank' />
                </div>
                <div>
                    <label>Número de Cuenta</label><br/>
                    <input type='text' placeholder='210535431174' />
                </div>
                <div>
                    <label>Número de Routing</label><br/>
                    <input type='text' placeholder='204318456' />
                </div>
                <div>
                    <label>Tipo de Cuenta</label><br/>
                    <select>
                        <option value=''>Selecciona una opción</option>
                        <option value='Checking'>Cuenta de Cheques</option>
                        <option value='Saving'>Cuenta de Ahorros</option>
                    </select>
                </div>
                <div>
                    <label>Nombre del Dueño de la Cuenta</label><br/>
                    <input type='text' placeholder='Pedro Milei' />
                </div>
            </div>
        </div>
    )
};

export default RegistroCuentaExterna;