import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';


const Profile = ()=>{
    const [{user,jwtoken}, dispatch] = useStateValue();
    const [email,setEmail] = useState(user ? user.email : '');
    const [fullName,setFullName] = useState(user ? `${user.first_name} ${user.last_name}` : '');
    const [type,setType] = useState(user ? user.type : '');
    const [kycStatus,setKycStatus] = useState();


    const startKYC = async (apiKey,fullName,email,type)=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });
            const idempotencyKey = uuidv4();
            const response = await axios({
                method:'post',
                url:'http://localhost:4000/bridge/customers/kyc_links',
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
        const getKYC = async ()=>{
            const kyc_link_record = await axios({
                method:'get',
                url:`http://localhost:4000/bridge/customers/kyc_links/${email}`,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${jwtoken}`
                }
            });
            if(kyc_link_record.status===200){
                const {msg,data} = kyc_link_record.data;
                if(!user.kyc_link_id){
                    user.kyc_link_id=data.id;
                    user.kyc_link=data.kyc_link;
                    user.kyc_status=data.kyc_status;
                }
                console.log(user);
            }
        };
        getKYC();
    },[]);

    return (
        <div>
            {/*<h1 className='font-openSauce font-bold text-[30px]'>Mi Perfil</h1>*/}
            <div>
                <div className='border-primary border-3 rounded-md py-2 px-4'>
                    <h2 className='font-openSauce font-bold text-[25px]'>KYC</h2>
                    {user.kyc_link === '' || !user.kyc_link ? (
                    <button className='bg-tertiary border-2 border-tertiary
                    text-primary font-garet font-bold rounded-md py-2 px-4'
                    onClick={()=>startKYC(import.meta.env.VITE_BRIDGE_API_KEY,fullName,email,type)}
                    >Comenzar proceso KYC</button>
                    ) : (
                        <div >
                            <p><strong>Status: </strong><span className={ `${user.kyc_status==='approved' ? 'bg-green-300' : bg-tertiary} border-2 border-tertiary text-primary font-garet font-bold rounded-md py-2 px-4 w-[20%]`}>{user.kyc_status}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Profile;