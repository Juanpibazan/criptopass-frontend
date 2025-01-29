import React, {useState,useEffect, act} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link,useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';


const TransferSection = ()=>{
    const [{user,jwtoken},dispatch] = useStateValue();
    const [fromAddress,setFromAddress] = useState('');
    const [liquidAmount,setLiquidAmount] = useState(0.00);
    const [developerFee,setDeveloperFee] = useState(0.00);
    const [transferType, setTransferType] = useState('');
    const [transferCost, setTransferCost] = useState(transferType==='wire' ? 20 : transferType === 'ach' ? 0.50 : transferType === 'ach_same_day' ? 1 : 0);
    const [destinatarios,setDestinatarios] = useState([]);
    const [externalAccount,setExternalAccount] = useState('');
    const [totalAmount,setTotalAmount] = useState(parseFloat(liquidAmount).toFixed(2)+parseFloat(transferCost)+(parseFloat(liquidAmount)*developerFee).toFixed(2));
    const [transferInitiated,setTransferInitiated] = useState(false);
    const [lastTransfer,setLastTransfer] = useState({});
    const [lastResponseStatus,setLastResponseStatus] = useState();

    const navigate = useNavigate();

    const fetchDestinatarios = async ()=>{
        try {
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            const customer_id = user.customer_id;
            const destinatariosResponse = await axios({
                method:'get',
                url:`https://criptopass-api-crqo.onrender.com/bridge/customers/destinatarios/${customer_id}`,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${jwtoken}`
                }
            });
            //setLastResponseStatus(destinatariosResponse.status);
            if(destinatariosResponse.status===200){
                toast.update(notificationId,{type:'success',render:destinatariosResponse.data.msg,isLoading:false});
                setDestinatarios(destinatariosResponse.data.data);
            } else {
                toast(destinatariosResponse.data.msg,{
                    type:'error',
                    position:'top-center'
                });
            }
        } catch(e){
            console.log(e);
            toast(e.response.data.msg,{
                type:'error',
                position:'top-center'
            });
        }

    };

    useEffect(()=>{
        setTransferCost(transferType==='wire' ? 20 : transferType === 'ach' ? 0.50 : transferType === 'ach_same_day' ? 1 : 0);
    },[transferType]);

    useEffect(()=>{
        const sumedAmount = parseFloat(liquidAmount)+parseFloat(transferCost)+(parseFloat(liquidAmount)*developerFee);
        setTotalAmount(sumedAmount.toFixed(2));
    },[liquidAmount,transferCost]);

    const createTransfer = async (apiKey,fromAddress,transferType,externalAccount,totalAmount,customer_id,developerFee)=>{
        try {
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
                if(!user.idempotencyKeys){
                    const idempotency_key = uuidv4();
                    console.log(idempotency_key);
                    dispatch({
                        type:actionTypes.SET_USER,
                        user: {
                            ...user,
                            idempotencyKeys: [{
                                idempotency_key,
                                endpoint:'/transfers'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys:[{
                            idempotency_key,
                            endpoint:'/transfers'
                        }]
                    }));
                    const transferResponse = await axios({
                        method:'post',
                        url:'https://criptopass-api-crqo.onrender.com/bridge/transfers/',
                        data:{
                            source: {
                                source_currency:"usdt",
                                source_payment_rail:"ethereum",
                                from_address:fromAddress
                            },
                            destination:{
                                destination_currency:"usd",
                                destination_payment_rail: transferType,
                                external_account_id: externalAccount
                            },
                            amount:`${totalAmount}`,
                            on_behalf_of:customer_id,
                            developer_fee:`${developerFee}`
                        },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(transferResponse.status===201){
                        const {status,msg,data} = transferResponse.data;
                        console.log("DATA 1 : ",data);
                        toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                        dispatch({
                            type: actionTypes.SET_USER,
                            user: {
                                ...user,
                                idempotencyKeys:[],
                                transfers: user.transfers ? [
                                    ...user.transfers,
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ] : [
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ]
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
                                idempotencyKeys:[],
                                transfers: user.transfers ? [
                                    ...user.transfers,
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ] : [
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ]
                            }
                        ));
                        console.log('ya se hizo el primer setItem()');
                        /*localStorage.setItem('user',JSON.stringify({
                            ...user,
                            idempotencyKeys: []
                        }));*/
                        setLastTransfer({
                            id: data.id,
                            state: data.state,
                            to_address: data.source_deposit_instructions.to_address,
                            transfer_type: data.destination.payment_rail,
                            receipt: data.receipt
                        });
                        setTransferInitiated(!transferInitiated);
                    } else{
                        const {status,msg} = transferResponse.data;
                        toast.update(notificationId,{type:'error',render:msg,isLoading:false});
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
                                endpoint:'/transfers'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [{
                            idempotency_key,
                            endpoint:'/transfers'
                        }]
                    }));
                    const transferResponse = await axios({
                        method:'post',
                        url:'https://criptopass-api-crqo.onrender.com/bridge/transfers/',
                        data:{
                            source: {
                                source_currency:"usdt",
                                source_payment_rail:"ethereum",
                                from_address:fromAddress
                            },
                            destination:{
                                destination_currency:"usd",
                                destination_payment_rail: transferType,
                                external_account_id: externalAccount
                            },
                            amount:`${totalAmount}`,
                            on_behalf_of:customer_id,
                            developer_fee:`${developerFee}`
                        },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(transferResponse.status===201){
                        const {status,msg,data} = transferResponse.data;
                        console.log("DATA 2 : ",data);
                        setLastTransfer({
                            id: data.id,
                            state: data.state,
                            to_address: data.source_deposit_instructions.to_address,
                            transfer_type: data.destination.payment_rail,
                            receipt: data.receipt
                        });
                        dispatch({
                            type: actionTypes.SET_USER,
                            user: {
                                ...user,
                                transfers: user.transfers ? [
                                    ...user.transfers,
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ] : [
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ]
                            }
                        });
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
                                transfers: user.transfers ? [
                                    ...user.transfers,
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ] : [
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ]
                            }
                        ));
                        localStorage.setItem('user',JSON.stringify({
                            ...user,
                            idempotencyKeys: []
                        }));
                        setTransferInitiated(!transferInitiated);
                    } else{
                        const {status,msg,data} = transferResponse.data;
                        toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                    }
                    
                } else if(user.idempotencyKeys.find((item)=>item.endpoint ==='/transfers')){
                    const idempotency_key = user.idempotencyKeys.find((item)=>item.endpoint === '/transfers').idempotency_key;
                    dispatch({
                        type:actionTypes.SET_USER,
                        user: {
                            ...user,
                            idempotencyKeys: [...user.idempotencyKeys,{
                                idempotency_key,
                                endpoint:'/transfers'
                            }]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [...user.idempotencyKeys,{
                            idempotency_key,
                            endpoint:'/transfers'
                        }]
                    }));
                    const transferResponse = await axios({
                        method:'post',
                        url:'https://criptopass-api-crqo.onrender.com/bridge/transfers/',
                        data:{
                            source: {
                                source_currency:"usdt",
                                source_payment_rail:"ethereum",
                                from_address:fromAddress
                            },
                            destination:{
                                destination_currency:"usd",
                                destination_payment_rail: transferType,
                                external_account_id: externalAccount
                            },
                            amount:`${totalAmount}`,
                            on_behalf_of:customer_id,
                            developer_fee:`${developerFee}`
                        },
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${jwtoken}`,
                            "Api-Key":apiKey,
                            "Idempotency-Key":idempotency_key
                        }
                    });
                    if(transferResponse.status===201){
                        const {status,msg,data} = transferResponse.data;
                        console.log("DATA 3 : ",data);
                        toast.update(notificationId,{type:'success',render:msg,isLoading:false});
                        dispatch({
                            type: actionTypes.SET_USER,
                            user: {
                                ...user,
                                transfers: user.transfers ? [
                                    ...user.transfers,
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ] : [
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ]
                            }
                        });
                        dispatch({
                            type:actionTypes.SET_USER,
                            user:{
                                ...user,
                                idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/transfers')]
                            }
                        });
                        localStorage.setItem('user',JSON.stringify({
                                ...user,
                                transfers: user.transfers ? [
                                    ...user.transfers,
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ] : [
                                    {
                                        id: data.id,
                                        state: data.state,
                                        to_address: data.source_deposit_instructions.to_address,
                                        transfer_type: data.destination.payment_rail,
                                        receipt: data.receipt
                                    }
                                ]
                            }
                        ));
                        localStorage.setItem('user',JSON.stringify({
                            ...user,
                            idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/transfers')]
                        }));
                        setLastTransfer({
                            id: data.id,
                            state: data.state,
                            to_address: data.source_deposit_instructions.to_address,
                            transfer_type: data.destination.payment_rail,
                            receipt: data.receipt
                        });
                        setTransferInitiated(!transferInitiated);
                    } else{
                        const {status,msg,data} = transferResponse.data;
                        toast.update(notificationId,{type:'error',render:msg,isLoading:false});
                    }
            } else {
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

    const isTokenExpired = (token)=>{
        if(!token){
            return true;
        }

        try{
            const decoded = jwtDecode(token);
            const {exp} = decoded;
            const currentTime = Date.now()/1000;
            if(exp<currentTime){
                return true;
            } else{
                return false;
            }
        } catch(e){
            console.log('Error al decodificar el jwt',e);
            return true;
        }
    };

    setInterval(()=>{
        if(isTokenExpired(jwtoken)){
            /*toast('La sesión finalizó, por favor vuelve a iniciarla.',{
                position:'top-center',
                type:'error',
                closeOnClick:true
            }); */
            setLastResponseStatus(401);
        }
    },1000*60);

    return (
        <div>
            <div className={`${lastResponseStatus===401 ? 'block' : 'hidden'}`}>
            <SessionEnded/>
            </div>
            <div className={`${lastResponseStatus===401 ? 'hidden' : 'block'}`}>
            <div >
                <h3 className='text-[25px] text-secondary font-bold font-openSauce'>Aspectos a considerar antes de empezar el proceso de transferencia</h3>
                <ol className='list-decimal text-primary font-bold'>
                    <li>La cuenta Destino ya debe estar registrada en Criptopass y debes tenerla agregada en destinatarios.</li>
                    <li>Tener una cuenta verificada en Binance</li>
                    <li>La transferencia se realizará a través de la red Ethereum</li>
                    <li>Tener como minimo 26 USDT (20 es el monto mínimo de transferencia, 6 es el fee fijo de Binance por transferencia a través de red crypto) en tu billetera Spot. Criptopass te cobrará una comisión de 2.5% por el monto, por lo cual deberás hacer la transferencia por el monto que deseas transferir más la comisión de Criptopass:
                        Monto deseado a transferir: 20 USDT.
                        Fee de Binance: 6 USDT.
                        Fee de CriptoPass: 0.5 USDT
                        Monto total a transferir a través de Criptopass: 20.5 USDT
                    </li>
                    <li>Cada tipo de transferencia tiene un costo particular. A continuación los costos:
                        <ul>
                        <li>ACH: $0.50</li>
                        <li>Same Day ACH: $1</li>
                        <li>Wire: $20</li>
                        </ul>
                    </li>
                </ol>
            </div>
            <div className='my-4'>
                <h2 className='text-[25px] text-secondary font-bold font-openSauce'>Iniciar Proceso de Transferencia</h2>
                <p className='font-garet text-primary text-[20px]'>Por favor rellena los siguientes campos para que podamos iniciar la transferencia:</p>
                <div className='flex flex-col justify-start items-start gap-4'>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Datos de origen</h3>
                        <div className='flex justify-start items-center gap-4'>
                            {/*<div className='w-[50%]'>
                                <label className='font-bold'>Dirección Billetera Spot de Binance (en Ethereum):</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='0xe15804194f8ced608d950eca9a2d421ef54a961d' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/>
                            </div> */}
                            <div className='w-[50%]'>
                                <label className='font-bold'>Monto líquido que desea que llegue a destino:</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='20.00' value={liquidAmount} onChange={(e)=>setLiquidAmount(e.target.value)}/>
                            </div>

                        </div>
                    </div>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Datos de Destino</h3>
                        <div className='flex max-sm:flex-col justify-start items-start gap-4'>
                            <div className='w-[50%] flex flex-col justify-start items-start gap-2'>
                                <label className='font-bold'>Cuenta Destino:</label><br/>
                                <div className='flex justify-start items-start gap-2'>
                                    <button className='bg-primary text-white py-2 px-4 border-primary border-2 rounded-sm' onClick={()=>fetchDestinatarios()}>Buscar destinatarios</button>
                                    <Link to='/register-recipient-accounts' className='bg-secondary text-white py-2 px-4 border-secondary border-2 rounded-sm' >Registrar destinatarios</Link>
                                </div>

                                {/*<input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='0xe15804194f8ced608d950eca9a2d421ef54a961d' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/> */}
                                {destinatarios.length===0 ? (
                                    <select className='w-full border-secondary border-2 rounded-sm' value={externalAccount} onChange={(e)=>setExternalAccount(e.target.value)}>
                                        <option value=''>No hay destinatarios registrados</option>
                                    </select>
                                ) : (
                                    <select className='w-full border-secondary border-2 rounded-sm' value={externalAccount} onChange={(e)=>setExternalAccount(e.target.value)}>
                                        <option value=''>Por favor selecciona un destinatario</option>
                                        {destinatarios.map((destinatario,index)=>{
                                            return (
                                                <option key={index} value={destinatario.destiny_external_account_id}>{destinatario.destiny_customer_alias}</option>
                                            )
                                        })}
                                    </select>
                                )}
                            </div>
                            <div className='w-[50%] max-sm:w-full h-full flex flex-col justify-between items-start'>
                                <label className='font-bold'>Tipo de Transferencia:</label><br/>
                                <select
                                className='w-full border-secondary border-2 rounded-sm' required={true} value={transferType} onChange={(e)=>setTransferType(e.target.value)}>
                                    <option value=''>Por favor selecciona una opcion</option>
                                    <option value='wire'>Wire</option>
                                    <option value='ach'>ACH</option>
                                    <option value='ach_same_day'>ACH Mismo Dia</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Costos relacionados</h3>
                        <div className='flex justify-between items-center gap-4 flex-wrap'>
                            <div className='w-[40%]'>
                                <label className='font-bold'>Costo de la transferencia:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm text'
                                type='text' value={transferType==='wire' ? 'USDT 20' : transferType === 'ach' ? 'USDT 0.50' : transferType === 'ach_same_day' ? 'USDT 1' : '-'}/>
                            </div>
                            <div className='w-[40%]'>
                                <label className='font-bold'>Comision de Criptopass:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' value={`${developerFee*100} %`}/>
                            </div>
                            <div className='w-[40%]'>
                                <label className='font-bold'>Comision fija de Binance:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' value={'6 USDT'}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Cálculo de los montos finales</h3>
                        <div className='flex justify-start items-start gap-4'>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Monto final de transferencia <span className='text-primary font-bold font-garet'>(Monto líquido que desea que llegue a destino + Costo de la transferencia + Comision de Criptopass)</span>:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm text'
                                type='text' value={totalAmount}/>
                            </div>
                            <div className='w-[50%] h-full flex flex-col justify-between items-start'>
                                <label className='font-bold'>Comisión de Binance:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' value='6 USDT'/>
                            </div>
                            

                        </div>
                        <div className='py-8 flex justify-self-end'>
                            <button className='bg-secondary border-primary border-2 rounded-sm font-bold font-garet text-primary px-4 py-2'
                            onClick={()=>createTransfer(import.meta.env.VITE_BRIDGE_API_KEY,fromAddress,transferType,externalAccount,totalAmount,user.customer_id,developerFee)}
                            >Comenzar Transferencia</button>
                        </div>
                    </div>
                    <div className={`min-h-screen w-[80%] absolute z-150
                        flex flex-col justify-center items-center gap-5
                        bg-secondary yellow-400 border-primary border-4 rounded-md shadow-md ${transferInitiated ? 'block' :'hidden'}`}>
                        <h3 className='text-[50px] max-sm:text-[30px] text-white font-bold font-openSauce'>Transferencia iniciada exitosamente</h3>
                        <ul className='list-disc px-6'>
                            <li className='text-[20px] max-sm:text-[15px] font-bold'>Código de la transferencia: <strong className='text-tertiary text-[10px] text-wrap'>{lastTransfer ? lastTransfer.id : ''}</strong></li>
                            <li className='text-[20px] max-sm:text-[15px] font-bold'>Estado: <strong className='text-tertiary'>{lastTransfer ? lastTransfer.state : ''}</strong></li>
                            <li className='text-[20px] max-sm:text-[15px] font-bold'>Cantidad Final: <strong className='text-tertiary'>{totalAmount}</strong></li>
                            <li className='text-[20px] max-sm:text-[15px] font-bold'>Cuenta a transferir USDT desde Binance: <strong className='text-tertiary'>{lastTransfer ? lastTransfer.to_address : ''}</strong></li>
                        </ul>
                        <Link to='/transfers' onClick={()=>setTransferInitiated(false)} className='py-2 px-4 bg-primary text-white text-[20px] border-primary border-2 rounded-sm'>Ir a transferencias</Link>
                    </div>
                </div>
            </div>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};


export default TransferSection;