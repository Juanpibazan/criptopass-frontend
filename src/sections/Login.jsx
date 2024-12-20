import React, {useState,useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

import CriptopassLogo from '../img/criptopass.svg';
import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';


const Login = ()=>{
    const [password,setPassword] = useState('');
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [passVisible, setPassVisible] = useState(false);
    const[email,setEmail] = useState('');
    const [{user,jwtoken}, dispatch] = useStateValue();

    const navigate = useNavigate();

    useEffect(()=>{
        const makePassVisible = ()=>{
            if(passVisible){
                document.getElementById('password').setAttribute('type','text');
            } else {
                document.getElementById('password').setAttribute('type','password');
            }
        };
        makePassVisible();
    },[passVisible]);

    const handleLogin = async (email, pass)=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            if(email !=='' && pass !== ''){
                const response = await axios({
                    method:'post',
                    url:'https://criptopass-api.onrender.com/criptopass/auth/login',
                    data:{
                        email,
                        password:pass
                    },
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                if(response.status===200){
                    const {status,msg,data} = response.data;
                    toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                    dispatch({
                        type: actionTypes.SET_JWT,
                        jwtoken: data.token
                    });
                    localStorage.setItem('jwtoken',data.token);
                    dispatch({
                        type: actionTypes.SET_USER,
                        user: data.user
                    });
                    localStorage.setItem('user',JSON.stringify(data.user));
                    setTimeout(()=>navigate('/home'),300);
                } else{
                    toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                }

            } else{
                toast.update(notificationId,{type:'error',render:'All fields must not be empty!!',isLoading:false});
            }

        } catch(e){
            console.log(e);
            toast(e.response.data.msg,{
                type:'error',
                position:'top-center'
            });
        }

    };

    return (
        <div className='flex flex-col justify-start items-center gap-4 mx-[40%] my-5 px-5 border-primary border-5'>
            <div className='border-b-3 border-primary rounded-sm'>
                <img src={CriptopassLogo} />
            </div>
            <div>
                <h1 className='text-[30px] text-primary'>Iniciar sesión</h1>
                <div>
                    <label>Correo electrónico</label><br/>
                    <input type='email' id='email' required={true} placeholder='joe_smith@brum.com'
                    className='border-2 border-primary' value={email} onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contraseña</label><br/>
                    <div className='flex justify-end items-center'>
                        <input type='password' id='password' required={true} className='border-2 border-primary'
                        placeholder='Contraseña' value={password} onChange={(e)=>setPassword(e.target.value)}  />
                        <span className='absolute' onClick={()=>setPassVisible(!passVisible)}>{passVisible ? <AiOutlineEyeInvisible className='text-[20px] font-bold text-primary' /> : <AiOutlineEye className='text-[20px] font-bold text-primary' />}</span>
                    </div>

                
                </div><br/>
                <div className='flex justify-center items-center'>
                    <button
                    className='bg-secondary border-secondary border-2 rounded-md text-white text-[20px] py-2 px-4'
                    onClick={()=>handleLogin(email,password)}
                    >Iniciar sesión</button>
                </div>

            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};

export default Login;
