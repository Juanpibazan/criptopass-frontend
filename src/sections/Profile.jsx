import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';


const Profile = ()=>{
    const [{user,jwtoken}, dispatch] = useStateValue();
    const [email,setEmail] = useState(user ? user.email : '');
    const [customerId,setCustomerId] = useState(user ? user.customer_id : '');
    const [fullName,setFullName] = useState(user ? `${user.first_name} ${user.last_name}` : '');
    const [type,setType] = useState(user ? user.type : '');
    const [kycStatus,setKycStatus] = useState(user.kyc_status ? user.kyc_status : 'not started');
    const [kycLink, setkycLink] = useState('');
    const [tosStatus,setTosStatus] = useState(user.tos_status ? user.tos_status : 'not started');
    const [tosLink, setTosLink] = useState('');
    const [lastResponseStatus,setLastResponseStatus] = useState();
    const [hasRun,setHasRun] = useState(false);
    const [sepaEndorsement, setSepaEndorsement] = useState({});
    const [sepaLink, setSepaLink] = useState('');
    const [sepaKYCStatus,setSepaKYCStatus] = useState('');
    const navigate = useNavigate();


    const getKYCLink = async ()=>{
        const notificationId = toast.loading("Por favor espere...",{
            closeOnClick:true
        });
        try{
        const kyc_link_record = await axios({
            method:'get',
            url:`https://criptopass.online/bridge/customers/kyc_links?email=${email}`,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${jwtoken}`
            }
        });
        setLastResponseStatus(kyc_link_record.status);
        if(kyc_link_record.status===200){
            const {msg,data} = kyc_link_record.data;
            toast.update(notificationId,{render:msg,type:'success',isLoading:false});
            setKycStatus(data.kyc_status);
            setTosStatus(data.tos_status);
            setkycLink(data.kyc_link);
            setTosLink(data.tos_link);
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
                toast.update(notificationId,{render:msg,type:'success',isLoading:false});
                setKycStatus(user.kyc_status ? user.kyc_status : data.kyc_status);
                setTosStatus(user.tos_status ? user.tos_status : data.tos_status);
                setkycLink(data.kyc_link);
                setTosLink(data.tos_link);
                //localStorage.setItem('user',JSON.stringify(user));
                console.log('Outside IF',user);
            }
            //toast.update(notificationId,{render:msg,type:'success',isLoading:false});
        }
        else if(kyc_link_record.status===204){
            //const noKYCLinkMsg = kyc_link_record.data.msg;
            toast.update(notificationId,{render: 'No KYC link found in db. You can start the process.',type:'success',isLoading:false});
            //setKycStatus(user.kyc_status);
            //setKycStatus(kyc_link_record.data.data);
        }
         else{
            console.log(kyc_link_record);
            toast.update(notificationId,{render:`Error ${kyc_link_record.status}`,type:'error',isLoading:false});
        }
    } catch(e){
        console.log(e);
        toast.update(notificationId,{render:e.response?.data?.msg || 'Error en la solicitud.',
            type:'error',
            isLoading: false
        });
    }
};


    const startKYC = async (apiKey,fullName,email,type,endorsements)=>{
        const notificationId = toast.loading("Por favor espere...",{
            closeOnClick:true
        });
        try{
            const idempotencyKey = uuidv4();
            const response = await axios({
                method:'post',
                url:'https://criptopass.online/bridge/customers/kyc_links',
                //url:'http://localhost:4000/bridge/customers/kyc_links',
                data:{
                    fullName,
                    email,
                    type,
                    endorsements
                },
                headers:{
                    "Content-Type":"application/json",
                    "Api-key":apiKey,
                    "Idempotency-Key":idempotencyKey,
                    "Authorization": `Bearer ${jwtoken}`
                }
            });
            setLastResponseStatus(response.status);
            if(response.status===200 || response.status===201){
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
                //getKYCLink();
                navigate('/home');
                
            } else{
                toast.update(notificationId,{render:msg,type:'error',isLoading:false});
            }
        }
        catch(e){
            console.log(e);
            toast.update(notificationId,{render:e.response?.data?.msg,
                type:'error',
                isLoading:false
            });
        }

    };

    
    useEffect(()=>{
            const controller = new AbortController();
            const {signal} = controller;
        const getKYC = async ()=>{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            try{
            if(!hasRun){
            const kyc_link_record = await axios({
                method:'get',
                url:`https://criptopass.online/bridge/customers/kyc_links?email=${email}`,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${jwtoken}`
                },
                signal
            });
            setLastResponseStatus(kyc_link_record.status);
            if(kyc_link_record.status===200){
                const {msg,data} = kyc_link_record.data;
                toast.update(notificationId,{render:msg,type:'success',isLoading:false});
                setKycStatus(data.kyc_status);
                setTosStatus(data.tos_status);
                setkycLink(data.kyc_link);
                setTosLink(data.tos_link);
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
                    toast.update(notificationId,{render:msg,type:'success',isLoading:false});
                    setKycStatus(user.kyc_status ? user.kyc_status : data.kyc_status);
                    setTosStatus(user.tos_status ? user.tos_status : data.tos_status);
                    setkycLink(data.kyc_link);
                    setTosLink(data.tos_link);
                    //localStorage.setItem('user',JSON.stringify(user));
                    console.log('Outside IF',user);
                }
                //toast.update(notificationId,{render:msg,type:'success',isLoading:false});
            }
            else if(kyc_link_record.status===204){
                //const noKYCLinkMsg = kyc_link_record.data.msg;
                toast.update(notificationId,{render: 'No KYC link found in db. You can start the process.',type:'success',isLoading:false});
                //setKycStatus(user.kyc_status);
                //setKycStatus(kyc_link_record.data.data);
            }
             else{
                console.log(kyc_link_record);
                toast.update(notificationId,{render:`Error ${kyc_link_record.status}`,type:'error',isLoading:false});
            }
            setHasRun(true);
        }
        } catch(e){
            console.log(e);
            toast.update(notificationId,{render:e.response?.data?.msg || 'Error en la solicitud.',
                type:'error',
                isLoading: false
            });
        }
    };
    const getCustomer = async ()=>{
        try {
            const customerResponse  = await axios({
                method:'get',
                url: `https://criptopass.online/bridge/customers/${customerId}`,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${jwtoken}`
                },
                signal
            });
            const {msg,data} = customerResponse.data;
            if(customerResponse.status===200){
                console.log('INFO DEL customer: ', data);
                const sepa_endorsement = data.endorsements.find((item)=>item.name==='sepa');
                console.log('SEPA: ', sepa_endorsement);
                setSepaEndorsement(sepa_endorsement);
                setSepaKYCStatus(sepa_endorsement.status);
                dispatch({
                    user:{
                        ...user,
                        sepa_kyc_status:sepa_endorsement.status
                    }
                });
                localStorage.setItem('user',JSON.stringify({
                    ...user,
                    sepa_kyc_status:sepa_endorsement.status
                }));
            } else{
                console.log('Response status code: ', customerResponse.status);
            }
        }
        catch(e){
            console.log(e);
        }
    };
    getKYC();
    getCustomer();
    return ()=>{
        controller.abort();
    };
    
    },
    //[kycStatus,tosStatus,hasRun]
    []
);

    const startKYCSepa = async ()=>{
        const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
        try {
            const generatedSepaResponse = await axios({
                method:'get',
                url: `https://criptopass.online/bridge/customers/sepa_kyc_links/${customerId}`,
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${jwtoken}`
                }
            });
            const {msg,data} = generatedSepaResponse.data;
            if(generatedSepaResponse.status===200 || generatedSepaResponse.status===503){
                toast.update(notificationId,{render:msg,type:'success',isLoading:false});
                setSepaLink(data.sepa_kyc_link);
                window.open(data.sepa_kyc_link,'_blank');
            } else{
                toast.update(notificationId,{render:msg,type:'error',isLoading:false});
            }
        }
        catch(e){
            toast.update(notificationId,{render:e.response?.data?.msg || 'Error en la solicitud.',
                type:'error',
                isLoading:false
            })
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
                    {(!kycStatus || kycStatus==='not started') ? (
                    <button className='bg-tertiary border-2 border-tertiary
                    text-primary font-garet font-bold rounded-md py-2 px-4'
                    onClick={()=>startKYC(import.meta.env.VITE_BRIDGE_API_KEY,fullName,email,type,[])}
                    >Comenzar proceso KYC</button>
                    ) : (
                        <div>
                            <div >
                                <p><strong>Status: </strong><span className={ `${kycStatus==='approved' ? 'bg-green-300' : 'bg-tertiary'} border-2 border-tertiary text-primary font-garet font-bold rounded-md py-2 px-4 w-[20%]`}>{user.kyc_status}</span></p>
                            </div>
                            <div>
                                <p className={kycStatus !=='approved' ? 'block' : 'hidden'}><strong> KYC Link: </strong><a target='_blank' href={kycLink} className={'text-primary bg-blue-100 font-garet font-bold text-[12px] hover:text-secondary'}>{kycLink}</a></p>  
                            </div>
                        </div>
                    )}
                </div>
                <div className='border-primary border-3 rounded-md py-2 px-4'>
                    <h2 className='font-openSauce font-bold text-[25px]'>TOS</h2>
                    {(tosStatus ==='' || tosStatus==='not started') ? (
                    <button className='bg-tertiary border-2 border-tertiary
                    text-primary font-garet font-bold rounded-md py-2 px-4'
                    onClick={()=>startKYC(import.meta.env.VITE_BRIDGE_API_KEY,fullName,email,type,[])}
                    >Aceptar TOS</button>
                    ) : (
                        <div>
                            <div >
                                <p><strong>Status: </strong><span className={ `${tosStatus==='approved' ? 'bg-green-300' : 'bg-tertiary'} border-2 border-tertiary text-primary font-garet font-bold rounded-md py-2 px-4 w-[20%]`}>{tosStatus}</span></p>
                            </div>
                            <div>
                                <p className={tosStatus !=='approved' ? 'block' : 'hidden'}><strong> TOS Link: </strong><a target='_blank' href={tosLink} className={'text-primary bg-blue-100 font-garet font-bold text-[12px] hover:text-secondary'}>{tosLink}</a></p>  
                            </div>
                        </div>
                    )}
                </div>
                {
                    (kycStatus==='approved' && tosStatus==='approved') && (
                        <div className='border-primary border-3 rounded-md py-4 px-8 my-8 bg-slate-300 w-[50%]'>
                            <h2 className='font-garet font-bold text-[20px] text-secondary'>Interesada(o) en hacer transferencias a Europa?</h2>
                            <div>
                                <h2 className='font-openSauce font-bold text-[25px]'>KYC adicional para SEPA</h2>
                                <div className='flex flex-col justify-start items-start gap-4'>
                                    <p><strong>Status: </strong><span className={`${sepaEndorsement.status ==='incomplete' ? 'bg-tertiary': 'bg-green-300'} border-2 border-tertiary text-primary font-garet font-bold rounded-md py-2 px-4`}>{sepaEndorsement.status}</span></p>
                                    {/*<button className='bg-secondary border-2 border-secondary
                                        text-primary font-garet font-bold rounded-md py-2 px-4 my-2'
                                        onClick={()=>startKYC(import.meta.env.VITE_BRIDGE_API_KEY,fullName,email,type,['sepa'])}>Generar SEPA KYC link</button>*/}
                                    <button className='bg-secondary border-2 border-secondary
                                        text-primary font-garet font-bold rounded-md py-2 px-4 my-2'
                                        onClick={()=>startKYCSepa()}>Generar SEPA KYC link</button>
                                    <span className='font-bold'>Ir a <a href={sepaLink || sepaLink !=='' ? sepaLink : ''} target='_blank' className={`${!sepaLink || sepaLink==='' ? 'hidden' : 'block'} font-bold text-primary bg-white border-2 border-primary px-4 py-2 rounded-md`}>SEPA KYC</a></span>               
                                </div>
                            </div>
                        </div>
                    )
                }

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
            <ToastContainer position='top-center' />
        </div>
    )
};

export default Profile;