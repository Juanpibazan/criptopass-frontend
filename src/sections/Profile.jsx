import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';


const Profile = ()=>{
    const [{user,jwtoken}, dispatch] = useStateValue();
    const [email,setEmail] = useState(user ? user.email : '');
    const [fullName,setFullName] = useState(user ? `${user.first_name} ${user.last_name}` : '');
    const [type,setType] = useState(user ? user.type : '');
    const [kycStatus,setKycStatus] = useState('not started');
    const [kycLink, setkycLink] = useState('');
    const [tosStatus,setTosStatus] = useState('not started');
    const [tosLink, setTosLink] = useState('');
    const [lastResponseStatus,setLastResponseStatus] = useState();


    const startKYC = async (apiKey,fullName,email,type)=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            const idempotencyKey = uuidv4();
            const response = await axios({
                method:'post',
                url:'https://criptopass-api.onrender.com/bridge/customers/kyc_links',
                //url:'http://localhost:4000/bridge/customers/kyc_links',
                data:{
                    fullName,
                    email,
                    type
                },
                headers:{
                    "Content-Type":"application/json",
                    "Api-key":apiKey,
                    "Idempotency-Key":idempotencyKey,
                    "Authorization": `Bearer ${jwtoken}`
                }
            });
            setLastResponseStatus(response.status);
            if(response.status===200){
                const {status,msg,data} = response.data;
                toast.update(notificationId,{render:msg,type:'success',isLoading:false});
                dispatch({
                    type: actionTypes.SET_USER,
                    user: {
                        ...user,
                        kyc_link_id: data.id,
                        kyc_link: data.kyc_link,
                        kyc_status: data.kyc_status
                        }
                });
                localStorage.setItem('user',JSON.stringify({
                    ...user,
                    kyc_link_id: data.id,
                    kyc_link: data.kyc_link,
                    kyc_status: data.kyc_status
                    }));
            } else{
                toast.update(notificationId,{render:msg,type:'error',isLoading:false});
            }
        }
        catch(e){
            console.log(e);
            toast(e.response.data.msg,{
                type:'error',
                position:'top-center'
            });
        }

    };

    useEffect(()=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
        const getKYC = async ()=>{
            const kyc_link_record = await axios({
                method:'get',
                url:`https://criptopass-api.onrender.com/bridge/customers/kyc_links?email=${email}`,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${jwtoken}`
                }
            });
            setLastResponseStatus(kyc_link_record.status);
            if(kyc_link_record.status===200){
                setKycStatus(kyc_link_record.data.kyc_status);
                setTosStatus(kyc_link_record.data.tos_status);
                setkycLink(kyc_link_record.data.kyc_link);
                setTosLink(kyc_link_record.data.tos_link);
                const {msg,data} = kyc_link_record.data;
                if(!user.kyc_link_id || user.kyc_link_id ===''){
                    /*user.kyc_link_id=data.id;
                    user.kyc_link=data.kyc_link;
                    user.kyc_status=data.kyc_status;*/
                    dispatch({
                        type: actionTypes.SET_USER,
                        user: {
                            ...user,
                            kyc_link_id: data.id,
                            kyc_link: data.kyc_link,
                            kyc_status: data.kyc_status,
                            tos_link:data.tos_link,
                            tos_status:data.tos_status
                            }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        kyc_link_id: data.id,
                        kyc_link: data.kyc_link,
                        kyc_status: data.kyc_status,
                        tos_link:data.tos_link,
                        tos_status:data.tos_status
                        }));
                    //localStorage.setItem('user',JSON.stringify(user));
                    console.log('Inside IF',user);
                } else{
                    setKycStatus(user.kyc_status ? user.kyc_status : data.kyc_status);
                    setTosStatus(user.tos_status ? user.tos_status : data.tos_status);
                    setkycLink(data.kyc_link);
                    setTosLink(data.tos_link);
                    //localStorage.setItem('user',JSON.stringify(user));
                    console.log('Outside IF',user);
                }
                toast.update(notificationId,{render:msg,type:'success',isLoading:false});
            } else{
                console.log(kyc_link_record);
                toast.update(notificationId,{render:msg,type:'error',isLoading:false});
            }
        };
        getKYC();
    } catch(e){
        console.log(e);
        toast(e.response.data.msg,{
            type:'error',
            position:'top-center'
        });
    }
    },[kycStatus,tosStatus]);

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

    const removeIdempotence = ()=>{
                    dispatch({
                        type:actionTypes.SET_USER,
                        user:{
                            ...user,
                            idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/transfers')]
                        }
                    });
                    localStorage.setItem('user',JSON.stringify({
                        ...user,
                        idempotencyKeys: [...user.idempotencyKeys.filter((item)=>item.endpoint !== '/transfers')]
                    }));
    };

    const findIdempotence = ()=>{
        const idempotence = user.idempotencyKeys.find((item)=>item.endpoint==='/transfers');
        console.log(idempotence);
    };

    const findLastTransfer = ()=>{
        console.log('last transfer',user.transfers.find(item =>item.id==="04d417b3-f6bc-4f12-9164-2ac02ce00697"));
    };

    return (
        <div>
            {/*<h1 className='font-openSauce font-bold text-[30px]'>Mi Perfil</h1>*/}
            <div className={`${lastResponseStatus===401 ? 'block' : 'hidden'}`}>
                <SessionEnded/>
            </div>
            <div className={`${lastResponseStatus===401 ? 'hidden': 'block'}`}>
                <div className='border-primary border-3 rounded-md py-2 px-4'>
                    <h2 className='font-openSauce font-bold text-[25px]'>KYC</h2>
                    {kycLink ==='' ? (
                    <button className='bg-tertiary border-2 border-tertiary
                    text-primary font-garet font-bold rounded-md py-2 px-4'
                    onClick={()=>startKYC(import.meta.env.VITE_BRIDGE_API_KEY,fullName,email,type)}
                    >Comenzar proceso KYC</button>
                    ) : (
                        <div>
                            <div >
                                <p><strong>Status: </strong><span className={ `${kycStatus==='approved' ? 'bg-green-300' : 'bg-tertiary'} border-2 border-tertiary text-primary font-garet font-bold rounded-md py-2 px-4 w-[20%]`}>{kycStatus}</span></p>
                            </div>
                            <div>
                                <p><strong> KYC Link: </strong><a href={kycLink} className={kycStatus !=='approved' ? 'text-primary bg-blue-100 font-garet font-bold text-[12px] hover:text-secondary block' : 'hidden'}>{kycLink}</a></p>  
                            </div>
                        </div>
                    )}
                </div>
                <div className='border-primary border-3 rounded-md py-2 px-4'>
                    <h2 className='font-openSauce font-bold text-[25px]'>TOS</h2>
                    {kycLink ==='' ? (
                    <button className='bg-tertiary border-2 border-tertiary
                    text-primary font-garet font-bold rounded-md py-2 px-4'
                    onClick={()=>startKYC(import.meta.env.VITE_BRIDGE_API_KEY,fullName,email,type)}
                    >Aceptar TOS</button>
                    ) : (
                        <div>
                            <div >
                                <p><strong>Status: </strong><span className={ `${tosStatus==='approved' ? 'bg-green-300' : 'bg-tertiary'} border-2 border-tertiary text-primary font-garet font-bold rounded-md py-2 px-4 w-[20%]`}>{tosStatus}</span></p>
                            </div>
                            <div>
                                <p><strong> TOS Link: </strong><a href={tosLink} className={tosStatus !=='approved' ? 'text-primary bg-blue-100 font-garet font-bold text-[12px] hover:text-secondary block' : 'hidden'}>{tosLink}</a></p>  
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/*<button
            onClick={()=>removeIdempotence()}
            className='bg-slate-500 text-white py-2 px-4'>Eliminar idempotency keys</button>
            <button
            onClick={()=>findIdempotence()}
            className='bg-slate-500 text-white py-2 px-4'>Encontrar idempotency keys</button>
            <button
            onClick={()=>findLastTransfer()}
            className='bg-slate-500 text-white py-2 px-4'>Encontrar last transfer</button> */}
        </div>
    )
};

export default Profile;