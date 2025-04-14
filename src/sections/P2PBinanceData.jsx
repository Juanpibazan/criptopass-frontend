import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import numeral from 'numeral';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';
import advData from '../utils/advData.json';

const P2PBinanceData = ()=>{

    const [{activeTitle, user,jwtoken},dispatch] = useStateValue();
    const [lastResponseStatus,setLastResponseStatus] = useState();
    const [binanceData,setBinanceData] = useState([]);

        const getData = async ()=>{
            const notificationId = toast.loading('Por favor espere...',{closeOnClick:true});
            try{
                if(user){
                    const binanceResponse = await axios({
                        method: 'POST',
                        url: 'https://p2p-fiat-binance.p.rapidapi.com/',
                        headers: {
                            'x-rapidapi-key': '07b5558d32msh50d6095c65dce73p13b64cjsncdedf82716ae',
                            'x-rapidapi-host': 'p2p-fiat-binance.p.rapidapi.com',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            fiat: 'BOB',
                            tradeType: 'BUY',
                            asset: 'USDT'
                        }
                    });
                    if(binanceResponse.status===200){
                        setBinanceData(binanceResponse.data);
                        toast.update(notificationId,{render:'Conexión exitosa con Binance P2P!',type:'success',isLoading:false});
                        console.log(binanceResponse.data);
                    }
                }
            }
            catch(e){
                console.log(e);
                toast.update(notificationId,{render:'Conexión no exitosa con Binance P2P!',type:'error',isLoading:false});
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
                    console.log('Expire en:',exp);
                    console.log('current dt:',currentTime);
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
        <div className='px-4 py-2'>
            <div className={`${lastResponseStatus===401 ? 'block' : 'hidden'}`}>
                <SessionEnded/>
            </div>
            <div className={`${lastResponseStatus===401 ? 'hidden' : 'block'}`}>
                <div className='flex flex-col justify-start items-start gap-4 my-4'>
                    <h2 className='text-[35px] text-primary font-bold'>Ofertas de USDT en tiempo real en Binance P2P</h2>
                    <button onClick={getData} className='bg-secondary border-2 border-secondary rounded-md text-white py-2 px-4 '>Obtener Ofertas de Binance P2P</button>
                    {binanceData.length > 0 && binanceData.map((item,index)=>{
                        return (
                            <div key={index} className='py-8 px-12 max-md:py-4 max-md:px-6 bg-tertiary border-primary border-2 rounded-[16px] w-[80%] max-md:w-full shadow-md'>
                                <div className='flex max-md:flex-col justify-start items-center max-md:items-start gap-4'>
                                    <h3 className='text-[18px] text-secondary font-bold'>{item.advertiser.nickName}</h3>
                                    <p className='text-[15px] text-secondary'>Transacciones finalizadas en los últimos 30d: <strong>{item.advertiser.monthOrderCount}</strong></p>
                                    <p className='text-[15px] text-secondary'>Tasa de finalización en los últimos 30d: <strong>{(item.advertiser.monthFinishRate*100).toFixed(2)}%</strong></p>
                                    <p className='text-[15px] text-secondary'>Comentarios positivos: <strong>{(item.advertiser.positiveRate*100).toFixed(2)}%</strong></p>
                                </div>
                                
                                <div >
                                <p className='text-[30px] text-primary'><span className='text-[20px]'>BOB </span><strong>{item.adv.price}</strong></p>
                                <ul className='list-disc px-8'>
                                    <li className='text-primary'>Monto mínimo de transacción (BOB): <strong>{numeral(item.adv.minSingleTransAmount).format('0,0.00')}</strong></li>
                                    <li className='text-primary'>Monto máximo de transacción (BOB): <strong>{numeral(item.adv.maxSingleTransAmount).format('0,0.00')}</strong></li>
                                    <li className='text-primary'>Monto disponible (USDT): <strong>{numeral(item.adv.tradableQuantity).format('0,0.00')}</strong></li>
                                </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
};

export default P2PBinanceData;