import React, {useState} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';
import { iso_country_codes } from '../utils/staticData';


const RegistroCuentaExterna = ()=>{

    const [accountType,setAccountType] = useState('');

    return (
        <div className='px-2'>
            <div className='flex max-sm:flex-col masx-sm:justify-start sm:justify-center max-sm:items-start sm:items-center gap-[50px]'>
                <button className={`${accountType==='usa' ? 'bg-secondary border-secondary' : 'bg-white border-primary'} border-2 rounded-sm shadow-md px-4 py-2 text-[20px]`} onClick={()=>setAccountType('usa')}>USA</button>
                <button className={`${accountType==='sepa' ? 'bg-secondary border-secondary' : 'bg-white border-primary'} border-2 rounded-sm shadow-md px-4 py-2 text-[20px]`} onClick={()=>setAccountType('sepa')}>Europa</button>
            </div>
            {accountType==='usa' ? (
                <CuentaExternaUSA />
            ) : accountType==='sepa' ? (
                <CuentaExternaSEPA />
            ) : <div></div>}
        </div>
    )
};

const CuentaExternaUSA = ()=>{
    
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
        country:'USA'
    });

    const createExternalAcount = async (apiKey,customer_id,bank_name, account_number,routing_number,account_type,account_owner_name,address)=>{
        const notificationId = toast.loading("Por favor espere...",{
            closeOnClick:true
        });
        try{
                if(!user.idempotencyKeys){
                    const idempotency_key = uuidv4();
                    console.log(idempotency_key);
                    dispatch({
                        type:actionTypes.SET_USER,
                        user: {
                            ...user,
                            idempotencyKeys: [{
                                idempotency_key,
                                endpoint:'/external_accounts'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys:[{
                            idempotency_key,
                            endpoint:'/external_accounts'
                        }]
                    }));
                    const externalAccountResponse = await axios({
                        method:'post',
                        url:`https://criptopass.com/bridge/customers/${customer_id}/external_accounts`,
                        //url:`http://localhost:4000/bridge/customers/${customer_id}/external_accounts`,
                        data:{
                                type: "raw",
                                bank_name, 
                                account_number,
                                routing_number,
                                account_name: account_type,
                                account_owner_name,
                                active: true,
                                address
                            },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(externalAccountResponse.status===201){
                        const {status,msg,data} = externalAccountResponse.data;
                                            console.log("DATA 1 : ",data);
                                            toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                                            dispatch({
                                                type: actionTypes.SET_USER,
                                                user: {
                                                    ...user,
                                                    idempotencyKeys:[],
                                                    
                                                }
                                            });
                                            console.log('ya se hizo el primer dispatch');
                                            /*dispatch({
                                                type:actionTypes.SET_USER,
                                                user:{
                                                    ...user,
                                                    idempotencyKeys: []
                                                }
                                            });*/
                                            localStorage.setItem('user',JSON.stringify({
                                                    ...user,
                                                    idempotencyKeys:[]
                                                }
                                            ));
                    } else{
                        const {status,msg} = externalAccountResponse.data;
                        toast.update(notificationId,{render:msg,type:'error',isLoading:false});
                    }
                } else if(user.idempotencyKeys.length===0){
                    //const idempotency_key = user.idempotencyKeys.length===0 ? uuidv4() : user.idempotencyKeys.find((item)=>item.endpoint === '/transfers').idempotency_key;
                    const idempotency_key = uuidv4();
                    dispatch({
                        type:actionTypes.SET_USER,
                        user: {
                            ...user,
                            idempotencyKeys: [{
                                idempotency_key,
                                endpoint:'/external_accounts'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [{
                            idempotency_key,
                            endpoint:'/external_accounts'
                        }]
                    }));
                    const externalAccountResponse = await axios({
                        method:'post',
                        url:`https://criptopass.com/bridge/customers/${customer_id}/external_accounts`,
                        data:{
                                type: "raw",
                                bank_name, 
                                account_number,
                                routing_number,
                                account_name: account_type,
                                account_owner_name,
                                active: true,
                                address
                            },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(externalAccountResponse.status===201){
                        const {status,msg,data} = externalAccountResponse.data;
                        console.log("DATA 2 : ",data);
                        toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                        dispatch({
                            type:actionTypes.SET_USER,
                            user:{
                                ...user,
                                idempotencyKeys: []
                            }
                        });
                        localStorage.setItem('user',JSON.stringify({
                            ...user,
                            idempotencyKeys: []
                        }));
                    } else{
                        const {status,msg} = externalAccountResponse.data;
                        toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                    }
            } else if(user.idempotencyKeys.find((item)=>item.endpoint ==='/external_accounts')){
                const idempotency_key = user.idempotencyKeys.find((item)=>item.endpoint === '/external_accounts').idempotency_key;
                dispatch({
                    type:actionTypes.SET_USER,
                    user: {
                        ...user,
                        idempotencyKeys: [...user.idempotencyKeys,{
                            idempotency_key,
                            endpoint:'/external_accounts'
                        }]
                    }
                });
                localStorage.setItem('user',JSON.stringify({
                    ...user,
                    idempotencyKeys: [...user.idempotencyKeys,{
                        idempotency_key,
                        endpoint:'/external_accounts'
                    }]
                }));
                const externalAccountResponse = await axios({
                    method:'post',
                    url:`https://criptopass.com/bridge/customers/${customer_id}/external_accounts`,
                    data:{
                        type: "raw",
                        bank_name, 
                        account_number,
                        routing_number,
                        account_name: account_type,
                        account_owner_name,
                        active: true,
                        address
                    },
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${jwtoken}`,
                        "Api-Key":apiKey,
                        "Idempotency-Key":idempotency_key
                    }
                });
                if(externalAccountResponse.status===201){
                    const {status,msg,data} = externalAccountResponse.data;
                    console.log("DATA 3 : ",data);
                    toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                    dispatch({
                        type:actionTypes.SET_USER,
                        user:{
                            ...user,
                            idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/external_accounts')]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/external_accounts')]
                    }));
                } else{
                    const {status,msg} = externalAccountResponse.data;
                    toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                }
        } else{
            toast.update(notificationId,{type:'error',render:'Error',isLoading:false});
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
        <div className='px-2'>
            <div className='flex flex-col justify-start items-start gap-4'>
                <h2 className='font-bold text-[22px]'>Información de la cuenta bancaria en USA</h2>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Nombre del Banco</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Lead Bank'
                    value={bankName} onChange={(e)=>setBankName(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Número de Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='210535431174'
                    value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Número de Routing</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='204318456'
                    value={routingNumber} onChange={(e)=>setRoutingNumber(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Tipo de Cuenta</label><br/>
                    <select className='w-full border-2 border-secondary rounded-sm'
                    value={accountType} onChange={(e)=>setAccounttype(e.target.value)}>
                        <option className='bg-slate-200' value=''>Selecciona una opción</option>
                        <option className='bg-secondary' value='Checking'>Cuenta de Cheques</option>
                        <option className='bg-secondary' value='Saving'>Cuenta de Ahorros</option>
                    </select>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Nombre del Dueño de la Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei'
                    value={accountOwnerName} onChange={(e)=>setAccountOwnerName(e.target.value)}/>
                </div>
                <div className='w-full'>
                    <h3 className='font-bold text-[20px]'>Dirección de la Oficina principal del Banco</h3>
                    <div className='w-full flex flex-row justify-start items-center gap-4 flex-wrap'>
                        <div className='w-[50%] max-sm:w-full'>
                            <label className='font-bold text-[17px] text-secondary'>Linea de Dirección 1</label><br/>
                            <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='101 Main St.'
                            value={address.street_line_1} onChange={(e)=>setAddress({...address,street_line_1:e.target.value})}/>
                        </div>
                        <div className='w-[50%] max-sm:w-full'>
                            <label className='font-bold text-[17px] text-secondary'>Linea de Dirección 2</label><br/>
                            <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder=''
                            value={address.street_line_2} onChange={(e)=>setAddress({...address,street_line_2:e.target.value})}/>
                        </div>
                        <div className='w-full flex justify-start items-center max-sm:items-start max-sm:flex-col gap-4'>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>Ciudad</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='Los Angeles'
                            value={address.city} onChange={(e)=>setAddress({...address,city:e.target.value})}/>
                        </div>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>Estado</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='California'
                            value={address.state} onChange={(e)=>setAddress({...address,state:e.target.value})}/>
                        </div>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>Código Postal</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='90001'
                            value={address.postal_code} onChange={(e)=>setAddress({...address,postal_code:e.target.value})}/>
                        </div>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>País</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='USA'
                            value={address.country} readOnly={true}
                            //onChange={(e)=>setAddress({...address,country:e.target.value})}
                            />
                        </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end items-center bg-secondary border-2 border-secondary rounded=md py-2 px-4 shadow-md font-bold'>
                    <button className='text-right' onClick={()=>createExternalAcount(import.meta.env.VITE_BRIDGE_API_KEY,user.customer_id,bankName,accountNumber,routingNumber,accountType,accountOwnerName,address)}>Registrar Cuenta Externa</button>
                </div>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};


const CuentaExternaSEPA = ()=>{
    
    const [{activeTitle,user,jwtoken},dispatch] = useStateValue();
    const [bankName,setBankName] = useState('');
    const [accountNumber,setAccountNumber] = useState();
    const [routingNumber,setRoutingNumber] = useState();
    const [accountType,setAccounttype] = useState('');
    const [accountIbanType,setAccountIbanType] = useState('iban');
    const [accountOwnerType,setAccountOwnerType] = useState(user ? user.type : '');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [accountOwnerName,setAccountOwnerName] = useState('');
    const [address,setAddress] = useState({
        street_line_1:'',
        street_line_2:'',
        city:'',
        state:'',
        postal_code:'',
        country:''
    });

    const createExternalAcount = async (apiKey,customer_id,bank_name, account_number,routing_number,account_type,account_owner_name,address)=>{
        const notificationId = toast.loading("Por favor espere...",{
            closeOnClick:true
        });
        try{
                if(!user.idempotencyKeys){
                    const idempotency_key = uuidv4();
                    console.log(idempotency_key);
                    dispatch({
                        type:actionTypes.SET_USER,
                        user: {
                            ...user,
                            idempotencyKeys: [{
                                idempotency_key,
                                endpoint:'/external_accounts'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys:[{
                            idempotency_key,
                            endpoint:'/external_accounts'
                        }]
                    }));
                    const externalAccountResponse = await axios({
                        method:'post',
                        url:`https://criptopass.com/bridge/customers/${customer_id}/external_accounts`,
                        //url:`http://localhost:4000/bridge/customers/${customer_id}/external_accounts`,
                        data:{
                                type: "raw",
                                bank_name, 
                                account_number,
                                routing_number,
                                account_name: account_type,
                                account_owner_name,
                                active: true,
                                address
                            },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(externalAccountResponse.status===201){
                        const {status,msg,data} = externalAccountResponse.data;
                                            console.log("DATA 1 : ",data);
                                            toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                                            dispatch({
                                                type: actionTypes.SET_USER,
                                                user: {
                                                    ...user,
                                                    idempotencyKeys:[],
                                                    
                                                }
                                            });
                                            console.log('ya se hizo el primer dispatch');
                                            /*dispatch({
                                                type:actionTypes.SET_USER,
                                                user:{
                                                    ...user,
                                                    idempotencyKeys: []
                                                }
                                            });*/
                                            localStorage.setItem('user',JSON.stringify({
                                                    ...user,
                                                    idempotencyKeys:[]
                                                }
                                            ));
                    } else{
                        const {status,msg} = externalAccountResponse.data;
                        toast.update(notificationId,{render:msg,type:'error',isLoading:false});
                    }
                } else if(user.idempotencyKeys.length===0){
                    //const idempotency_key = user.idempotencyKeys.length===0 ? uuidv4() : user.idempotencyKeys.find((item)=>item.endpoint === '/transfers').idempotency_key;
                    const idempotency_key = uuidv4();
                    dispatch({
                        type:actionTypes.SET_USER,
                        user: {
                            ...user,
                            idempotencyKeys: [{
                                idempotency_key,
                                endpoint:'/external_accounts'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [{
                            idempotency_key,
                            endpoint:'/external_accounts'
                        }]
                    }));
                    const externalAccountResponse = await axios({
                        method:'post',
                        url:`https://criptopass.com/bridge/customers/${customer_id}/external_accounts`,
                        data:{
                                type: "raw",
                                bank_name, 
                                account_number,
                                routing_number,
                                account_name: account_type,
                                account_owner_name,
                                active: true,
                                address
                            },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(externalAccountResponse.status===201){
                        const {status,msg,data} = externalAccountResponse.data;
                        console.log("DATA 2 : ",data);
                        toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                        dispatch({
                            type:actionTypes.SET_USER,
                            user:{
                                ...user,
                                idempotencyKeys: []
                            }
                        });
                        localStorage.setItem('user',JSON.stringify({
                            ...user,
                            idempotencyKeys: []
                        }));
                    } else{
                        const {status,msg} = externalAccountResponse.data;
                        toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                    }
            } else if(user.idempotencyKeys.find((item)=>item.endpoint ==='/external_accounts')){
                const idempotency_key = user.idempotencyKeys.find((item)=>item.endpoint === '/external_accounts').idempotency_key;
                dispatch({
                    type:actionTypes.SET_USER,
                    user: {
                        ...user,
                        idempotencyKeys: [...user.idempotencyKeys,{
                            idempotency_key,
                            endpoint:'/external_accounts'
                        }]
                    }
                });
                localStorage.setItem('user',JSON.stringify({
                    ...user,
                    idempotencyKeys: [...user.idempotencyKeys,{
                        idempotency_key,
                        endpoint:'/external_accounts'
                    }]
                }));
                const externalAccountResponse = await axios({
                    method:'post',
                    url:`https://criptopass.com/bridge/customers/${customer_id}/external_accounts`,
                    data:{
                        type: "raw",
                        bank_name, 
                        account_number,
                        routing_number,
                        account_name: account_type,
                        account_owner_name,
                        active: true,
                        address
                    },
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${jwtoken}`,
                        "Api-Key":apiKey,
                        "Idempotency-Key":idempotency_key
                    }
                });
                if(externalAccountResponse.status===201){
                    const {status,msg,data} = externalAccountResponse.data;
                    console.log("DATA 3 : ",data);
                    toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                    dispatch({
                        type:actionTypes.SET_USER,
                        user:{
                            ...user,
                            idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/external_accounts')]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/external_accounts')]
                    }));
                } else{
                    const {status,msg} = externalAccountResponse.data;
                    toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                }
        } else{
            toast.update(notificationId,{type:'error',render:'Error',isLoading:false});
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
        <div className='px-2'>
            <div className='flex flex-col justify-start items-start gap-4'>
                <h2 className='font-bold text-[22px]'>Información de la cuenta bancaria en Europa</h2>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Nombre del Banco</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Lead Bank'
                    value={bankName} onChange={(e)=>setBankName(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Número de Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='210535431174'
                    value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Número de Routing</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='204318456'
                    value={routingNumber} onChange={(e)=>setRoutingNumber(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Tipo de Cuenta</label><br/>
                    <select className='w-full border-2 border-secondary rounded-sm'
                    value={accountType} onChange={(e)=>setAccounttype(e.target.value)}>
                        <option className='bg-slate-200' value=''>Selecciona una opción</option>
                        <option className='bg-secondary' value='Checking'>Cuenta de Cheques</option>
                        <option className='bg-secondary' value='Saving'>Cuenta de Ahorros</option>
                    </select>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Nombre del Dueño de la Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Pedro'
                    value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                </div>
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Apellido del Dueño de la Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Milei'
                    value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                </div>
                <div className={`${accountOwnerType==='business' ? 'block' : 'hidden'} w-[50%] max-sm:w-full`}>
                    <label className='font-bold text-[17px] text-secondary'>Nombre de la Empresa Dueña de la Cuenta</label><br/>
                    <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Importadora XYZ S.A.'
                    value={businessName} onChange={(e)=>setBusinessName(e.target.value)}/>
                </div>
                {accountOwnerType!=='business' && (
                <div className='w-[50%] max-sm:w-full'>
                    <label className='font-bold text-[17px] text-secondary'>Nombre Completo del Dueño de la Cuenta</label><br/>
                    <input readOnly={true} className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='Pedro Milei'
                    value={accountOwnerType==='business' ? businessName : (firstName + ' ' + lastName)}/>
                </div>
                )}

                <div className='w-full'>
                    <h3 className='font-bold text-[20px]'>Dirección de la Oficina principal del Banco</h3>
                    <div className='w-full flex flex-row justify-start items-center gap-4 flex-wrap'>
                        <div className='w-[50%] max-sm:w-full'>
                            <label className='font-bold text-[17px] text-secondary'>Linea de Dirección 1</label><br/>
                            <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder='101 Main St.'
                            value={address.street_line_1} onChange={(e)=>setAddress({...address,street_line_1:e.target.value})}/>
                        </div>
                        <div className='w-[50%] max-sm:w-full'>
                            <label className='font-bold text-[17px] text-secondary'>Linea de Dirección 2</label><br/>
                            <input className='w-full border-2 border-secondary rounded-sm' type='text' placeholder=''
                            value={address.street_line_2} onChange={(e)=>setAddress({...address,street_line_2:e.target.value})}/>
                        </div>
                        <div className='w-full flex justify-start items-center max-sm:items-start max-sm:flex-col gap-4'>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>Ciudad</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='Los Angeles'
                            value={address.city} onChange={(e)=>setAddress({...address,city:e.target.value})}/>
                        </div>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>Estado</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='California'
                            value={address.state} onChange={(e)=>setAddress({...address,state:e.target.value})}/>
                        </div>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>Código Postal</label><br/>
                            <input className='border-2 border-secondary rounded-sm' type='text' placeholder='90001'
                            value={address.postal_code} onChange={(e)=>setAddress({...address,postal_code:e.target.value})}/>
                        </div>
                        <div>
                            <label className='font-bold text-[17px] text-secondary'>País</label><br/>
                            <select className='border-2 border-secondary rounded-sm' placeholder='USA'
                            value={address.country} onChange={(e)=>setAddress({...address,country:e.target.value})}>
                                {iso_country_codes.map((country, index)=>{
                                    return (
                                        <option key={index} value={country.id}>{country.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end items-center bg-secondary border-2 border-secondary rounded=md py-2 px-4 shadow-md font-bold'>
                    <button className='text-right' onClick={()=>createExternalAcount(import.meta.env.VITE_BRIDGE_API_KEY,user.customer_id,bankName,accountNumber,routingNumber,accountType,accountOwnerName,address)}>Registrar Cuenta Externa</button>
                </div>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};

export default RegistroCuentaExterna;