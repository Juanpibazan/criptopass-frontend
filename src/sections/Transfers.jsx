import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';

const Transfers = ()=>{
    const [{user,jwtoken},dispatch] = useStateValue();
    const [transfers,setTransfers] = useState([]);
    const [limit,setLimit] = useState(10);
    const [lastResponseStatus,setLastResponseStatus] = useState();

    useEffect( ()=>{
            const controller = new AbortController();
            const {signal} = controller;
            const fetchTransfers = async ()=>{
                const notificationId = toast.loading("Por favor espere...",{
                    closeOnClick:true
                });
                try{
                const transfersResponse = await axios({
                    method:'get',
                    //url:`https://criptopass-api-crqo.onrender.com/bridge/transfers/${user.customer_id}?limit=${limit}`,
                    url:`http://193.203.174.82:5000/bridge/transfers/${user.customer_id}?limit=${limit}`,
                    headers:{
                        "Content-Type":"application/json",
                        "Api-Key": import.meta.env.VITE_BRIDGE_API_KEY,
                        "Authorization":`Bearer ${jwtoken}`
                    },
                    signal
                });
                const {msg,data} = transfersResponse.data.data;
                //setLastResponseStatus(transfersResponse.status);
                console.log(transfersResponse.status);
                if(transfersResponse.status===200){
                    toast.update(notificationId,{render:msg,type:'success',isLoading:false});
                    console.log(data);
                    setTransfers(data);

                }
                else{
                    toast.update(notificationId,{render:msg,type:'error',isLoading:false});
                    return msg;
                }
            //console.log('my_transfers: ',my_transfers);
            
            }
            catch(e){
                console.log(e);
                console.log('Llega hasta aca en el catch, antes del useNavigate()');
                toast(e.response.data.msg,{
                    type:'error',
                    position:'top-center'
                });
            }
        };
        fetchTransfers();
        return () => {
            // Cancela la solicitud al desmontar el componente.
            controller.abort();
          };
    },[limit]);

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
            {lastResponseStatus===401 ? (
                <SessionEnded />
            ) : (
                <div>
                <h1 className='text-[25px] text-primary font-bold text-center'>Transferencias</h1>
                {transfers.length>0 ?
                <div className='flex flex-col justify-start items-center gap-4'>
                    <table className='border-4 border-secondary rounded-sm min-h-screen' >
                            <tr className='border-2 border-secondary rounded-sm my-4 mx-2'>
                                <th className='px-1 border-secondary border-2 text-left'>#</th>
                                <th className='px-2 border-secondary border-2 text-left'>Código</th>
                                <th className='px-2 border-secondary border-2 text-left'>Estado</th>
                                <th className='px-2 border-secondary border-2 text-left'>Cantidad Final (USDT)</th>
                                <th className='px-2 border-secondary border-2 text-left'>Cuenta a transferir USDT desde Binance</th>
                                <th className='px-2 border-secondary border-2 text-left'>Iniciada en</th>
                            </tr>
                            <tbody>
                            {transfers.map((transfer,index)=>{
                                return (
                                    <tr key={transfer.id} className='py-4 text-[10px]'>
                                        <td className='px-1 border-secondary border-2'>{index}</td>
                                        <td className='px-2 border-secondary border-2'>{transfer.id}</td>
                                        <td className={`${transfer.state==='awaiting_funds' ? 'text-yellow-600 px-2' : transfer.state==='canceled' ? 'text-red-500 px-2' : transfer.state==='payment_processed' ? 'text-green-500 px-2' : 'text-slate-700 px-2'}  border-secondary border-2`}>{transfer.state}</td>
                                        <td className='px-2 border-secondary border-2'>{transfer.receipt.final_amount}</td>
                                        <td className='px-2 border-secondary border-2'>{transfer.source_deposit_instructions.to_address}</td>
                                        <td className='px-2 border-secondary border-2'>{transfer.created_at}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                    </table>
                    <select value={limit} onChange={(e)=>setLimit(e.target.value)}
                        className='border-2 border-primary rounded-sm'>
                        <option value={10}>10 registros</option>
                        <option value={30}>30 registros</option>
                        <option value={50}>50 registros</option>
                    </select>
                    </div>
                    : <h2 className='text-center font-bold text-secondary text-[20px]'>No cuenta con transferencias realizadas</h2>
                }
                </div>
            )}
        <ToastContainer position='top-center'/>
        </div>
    )
};


export default Transfers;
