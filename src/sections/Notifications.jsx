import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const Notifications = ()=>{

    const [{user},dispatch] = useStateValue();

    useEffect(()=>{
        console.log('Notifications');
    },[]);

    return (
        <div>
            
        </div>
    )
};


export default Notifications;
