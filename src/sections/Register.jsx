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


const Register = ()=>{
    const [password,setPassword] = useState('');
    const [passVisible, setPassVisible] = useState(false);
    const[email,setEmail] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [sex,setSex] = useState('');
    const [birthDate,setBirthDate] = useState('');
    const [type,setType] = useState('');
    const [city,setCity] = useState('');
    const [country,setCountry] = useState('');
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

    const handleRegister = async (email, pass, first_name,last_name, sex, birth_date, type, city, country)=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            if(type !=='' &&  email !=='' && pass !== '' && first_name !=='' && last_name !=='' && sex !=='' && birth_date !=='' && city !=='' && country !==''){
                const response = await axios({
                    method:'post',
                    url:'https://criptopass-api.onrender.com/criptopass/auth/register',
                    data:{
                        email,
                        password:pass,
                        first_name,
                        last_name,
                        sex,
                        birth_date,
                        type,
                        city,
                        country
                    },
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                if(response.status===201){
                    console.log('This is the RESPONSE: ',response);
                    const {status,msg,data} = response.data;
                    toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                    console.log('This is the DATA: ',data);
                    dispatch({
                        type: actionTypes.SET_JWT,
                        jwtoken: data.token
                    });
                    localStorage.setItem('jwtoken',data.token);
                    dispatch({
                        type: actionTypes.SET_USER,
                        user: data.user
                    });
                    console.log(data.user);
                    localStorage.setItem('user',JSON.stringify(data.user));
                    setTimeout(()=>navigate('/home'),1000);
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
                <label>Tipo de Cuenta</label><br/>
                <select id='account-type' className='border-2 border-primary' required={true} value={type} onChange={(e)=>setType(e.target.value)}>
                        <option value=''>Por favor selecciona una opción:</option>
                        <option value='individual'>Individual</option>
                        <option value='business'>Corporativa</option>
                    </select>
                </div><br/>
                <div>
                    <label>Correo electrónico</label><br/>
                    <input type='email' id='email' required={true} placeholder='pedro@brum.com'
                    className='border-2 border-primary' value={email} onChange={(e)=>setEmail(e.target.value)}
                    />
                </div><br/>
                <div>
                    <label>Contraseña</label><br/>
                    <div className='flex justify-between items-center w-[220px]'>
                        <input type='password' id='password' required={true} className='border-2 border-primary'
                        placeholder='Contraseña' value={password} onChange={(e)=>setPassword(e.target.value)}  />
                        <span className='flex justify-self-end' onClick={()=>setPassVisible(!passVisible)}>{passVisible ? <AiOutlineEyeInvisible className='text-[20px] font-bold text-primary' /> : <AiOutlineEye className='text-[20px] font-bold text-primary' />}</span>
                    </div>
                </div><br/>
                <div>
                <label>Nombres</label><br/>
                    <input type='text' id='first-name' required={true} placeholder='Pedro Pablo'
                    className='border-2 border-primary' value={firstName} onChange={(e)=>setFirstName(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                <label>Apellidos</label><br/>
                    <input type='text' id='last-name' required={true} placeholder='Barrera Justiniano'
                    className='border-2 border-primary' value={lastName} onChange={(e)=>setLastName(e.target.value)}
                    />
                </div><br/>
                <div>
                <label>Género</label><br/>
                    <select id='sex' className='border-2 border-primary' required={true} value={sex} onChange={(e)=>setSex(e.target.value)}>
                        <option value=''>Por favor selecciona una opción:</option>
                        <option value='F'>Femenino</option>
                        <option value='M'>Masculino</option>
                    </select>
                </div><br/>
                <div>
                <label>Fecha de Nacimiento</label><br/>
                    <input type='date' id='birth-date' required={true}
                    className='border-2 border-primary' value={birthDate} onChange={(e)=>setBirthDate(e.target.value)}
                    />
                </div><br/>
                <div>
                <label>Ciudad</label><br/>
                    <input type='text' id='city' required={true} placeholder='Santa Cruz'
                    className='border-2 border-primary' value={city} onChange={(e)=>setCity(e.target.value)}
                    />
                </div><br/>
                <div>
                <label>País</label><br/>
                    <input type='text' id='country' required={true} placeholder='Bolivia'
                    className='border-2 border-primary' value={country} onChange={(e)=>setCountry(e.target.value)}
                    />
                </div><br/>
                <div className='flex justify-center items-center'>
                    <input type='submit'
                    className='bg-secondary border-secondary border-2 rounded-md text-white text-[20px] py-2 px-4 cursor-pointer'
                    onClick={()=>handleRegister(email,password,firstName,lastName,sex,birthDate,type,city,country)}
                    value='Iniciar sesión' />
                </div>

            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};

export default Register;
