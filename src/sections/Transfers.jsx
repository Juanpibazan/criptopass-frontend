import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';

const Transfers = ()=>{
    const [{user,jwtoken},dispatch] = useStateValue();
    const [transfers,setTransfers] = useState([]);
    const [lastResponseStatus,setLastResponseStatus] = useState();

    useEffect( ()=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            const fetchTransfers = async ()=>{
                const transfersResponse = await axios({
                    method:'get',
                    url:`https://criptopass-api.onrender.com/bridge/transfers/${user.customer_id}`,
                    headers:{
                        "Content-Type":"application/json",
                        "Api-Key": import.meta.env.VITE_BRIDGE_API_KEY,
                        "Authorization":`Bearer ${jwtoken}`
                    }
                });
                const {msg,data} = transfersResponse.data.data;
                setLastResponseStatus(transfersResponse.status);
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
            };
            fetchTransfers();
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
    },[]);

    return (
        <div>
            {lastResponseStatus===401 || !lastResponseStatus ? (
                <SessionEnded />
            ) : (
                <div>
                <h1 className='text-[25px] text-primary font-bold'>Transferencias</h1>
                    <div className='border-4 border-secondary rounded-sm min-h-screen' >
                            <div className='flex justify-between items-center border-2 border-secondary rounded-sm my-4 mx-2'>
                                <h3 className='px-2'>Código</h3>
                                <h3 className='px-2'>Estado</h3>
                                <h3 className='px-2'>Cantidad Final (USDT)</h3>
                                <h3 className='px-2'>Cuenta a transferir USDT desde Binance</h3>
                            </div>
                            {transfers.map((transfer,index)=>{
                                return (
                                    <div key={transfer.id} className='flex justify-between start items-center py-4 text-[10px]'>
                                        <h4 className='px-2'>{transfer.id}</h4>
                                        <h4 className={transfer.state==='awaiting_funds' ? 'text-yellow-200 px-2' : transfer.state==='canceled' ? 'text-red-500 px-2' : transfer.state==='approved' ? 'text-green-300 px-2' : 'text-slate-600 px-2'}>{transfer.state}</h4>
                                        <h4 className='px-2'>{transfer.receipt.final_amount}</h4>
                                        <h4 className='px-2'>{transfer.source_deposit_instructions.to_address}</h4>
                                    </div>
                                )
                            })}
                        
                    </div>
                </div>
            )}

        </div>
    )
};


export default Transfers;
