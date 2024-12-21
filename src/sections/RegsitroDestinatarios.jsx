import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const RegistroDestinatarios = ()=>{
    
    return (
        <div>Registro destinatarios</div>
    )
};

export default RegistroDestinatarios;