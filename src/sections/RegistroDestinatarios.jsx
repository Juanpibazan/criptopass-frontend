import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';
import SessionEnded from '../Components/SessionEnded';

const RegistroDestinatarios = ()=>{
    const [{activeTitle, user,jwtoken},dispatch] = useStateValue();
    const [activeTab,setActiveTab] = useState('');
    const [dropdownShowing,setDropdownShowing] = useState(false);
    const [searchString,setSearchString] = useState('');
    const [searchItems, setSearchItems] = useState([]);
    const [destinyAlias,setDestinyAlias] = useState('');
    const [lastResponseStatus,setLastResponseStatus] = useState();

    const handleSearch = async (string)=>{
        try{
            setDropdownShowing(!dropdownShowing);
            setSearchString(string);
        if(string.length>=5){
        const foundCustomer = await axios({
            method:'get',
            url:`https://criptopass-api.onrender.com/bridge/customers/find/${string}`,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${jwtoken}`
            }
        });
        //setLastResponseStatus(foundCustomer.status);
        const {msg,data} = foundCustomer.data;
        if(foundCustomer.status===200){
            if(data.length===0){
                setSearchItems([msg]);
            } else{
                setSearchItems(data);
            }
        } else{
            toast(msg,{
                type:'error',
                isLoading:false,
                position:'top-center'
            })
        }
    } else{
        setSearchItems([]);
    }
    }catch(e){
            console.log(e);
            toast(e.response.data.msg,{
                type:'error',
                position:'top-center'
            });
    }
    };

    const addDestiny = async ()=>{
        try{
            const notificationId = toast.loading("Por favor espere...",{
                closeOnClick:true
            });            
            const response = await axios({
                method:'post',
                url:'https://criptopass-api.onrender.com/bridge/customers/destinatarios',
                data:{
                    destiny_external_account_id:searchItems[0].external_account_id,
                    destiny_customer_id:searchItems[0].id,
                    destiny_customer_alias: destinyAlias,
                    origin_customer_id: user.customer_id
                },
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${jwtoken}`
                }
            });
            //setLastResponseStatus(response.status);
            const {msg} = response.data;
            if(response.status===201){
                toast.update(notificationId,{render:msg,type:'success',isLoading:false});
            }
            else{
                toast.update(notificationId,{render:msg,type:'error',isLoading:false});
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
            <div className='flex justify-start items-center gap-10'>
                <div>
                    <h3 className='text-[20px] text-primary font-openSauce font-bold'>Buscar destinatario por email</h3>
                    <input type='text' value={searchString} onChange={(e)=>handleSearch(e.target.value)}
                    className={`border-secondary border-2 rounded-sm`}
                    />
                    <select>
                        {searchItems.map((item, index)=>{
                            return (
                                <option key={index} className={`${!dropdownShowing ? 'hidden' : 'block'} font-garet`}>{(!item.first_name && !item.last_name) ? item : item.first_name + ' '+ item.last_name}</option>
                            )
                        })}
                    </select>

                </div>
                <div>
                    <label className='text-[20px] text-primary font-openSauce font-bold'>Asignar un alias/nickname al destinatario</label><br/>
                    <input className='border-secondary border-2 rounded-sm'
                    type='text' placeholder='Mi propia cuenta/Cuenta de mi BFF/Cuenta del proveedor 1' value={destinyAlias} onChange={(e)=>setDestinyAlias(e.target.value)} />
                </div>
            </div>
            <button
            className='my-4 bg-secondary text-white font-garet px-4 py-2 border-secondary border-2 rounded-md'
            onClick={()=>addDestiny()}
            >Agregar destinatario</button>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};

export default RegistroDestinatarios;