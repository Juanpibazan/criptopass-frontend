import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';


const TransferSection = ()=>{
    const [{user,jwtoken},dispatch] = useStateValue();
    const [fromAddress,setFromAddress] = useState('');
    const [liquidAmount,setLiquidAmount] = useState(0.00);
    const [developerFee,setDeveloperFee] = useState(0.025);
    const [transferType, setTransferType] = useState('');
    const [transferCost, setTransferCost] = useState(transferType==='wire' ? 20 : transferType === 'ach' ? 0.50 : transferType === 'ach_same_day' ? 1 : 0);
    const [destinatarios,setDestinatarios] = useState([]);
    const [externalAccount,setExternalAccount] = useState('');

    const fetchDestinatarios = async ()=>{
        try {
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            const customer_id = user.customer_id;
            const destinatariosResponse = await axios({
                method:'get',
                url:`https://criptopass-api.onrender.com/bridge/customers/destinatarios/${customer_id}`,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${jwtoken}`
                }
            });
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
        setTransferCost(transferType==='wire' ? 20 : transferType === 'ach' ? 0.50 : transferType === 'ach_same_day' ? 1 : 0)
    },[transferType]);

    return (
        <div>
            <div>
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
                            <div className='w-[50%]'>
                                <label className='font-bold'>Dirección Billetera Spot de Binance (en Ethereum):</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='0xe15804194f8ced608d950eca9a2d421ef54a961d' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/>
                            </div>
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
                        <div className='flex justify-start items-center gap-4'>
                            <div className='w-[50%] flex flex-col justify-start items-start gap-2'>
                                <label className='font-bold'>Cuenta Destino:</label><br/>
                                <div className='flex justify-start items-center gap-2'>
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
                            <div className='w-[50%]'>
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
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Calculo de los montos finales</h3>
                        <div className='flex justify-start items-center gap-4'>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Monto final de transferencia <span className='text-primary font-bold font-garet'>(Monto líquido que desea que llegue a destino + Costo de la transferencia + Comision de Criptopass)</span>:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm text'
                                type='text' value={parseFloat(liquidAmount)+parseFloat(transferCost)+(parseFloat(liquidAmount)*developerFee)}/>
                            </div>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Comision de Binance:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' value={`${developerFee*100} %`}/>
                            </div>
                            

                        </div>
                        <div className='py-8 flex justify-self-end'>
                            <button className='bg-secondary border-primary border-2 rounded-sm font-bold font-garet text-primary px-4 py-2 '>Comenzar Transferencia</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};


export default TransferSection;