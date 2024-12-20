import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const Home = ()=>{


    return (
        <div>
            <div className='py-2 px-4'>
                <div>
                    <h2>Quieres transferir USDT y convertirlos en USD??</h2>
                </div>


            </div>
        </div>
    )
};


export default Home;
