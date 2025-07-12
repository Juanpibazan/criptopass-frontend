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
    const [selectedItem,setSelectedItem] = useState({});
    const [destinyAlias,setDestinyAlias] = useState('');
    const [lastResponseStatus,setLastResponseStatus] = useState();

    const handleSearch = async (string)=>{
        try{
            setDropdownShowing(!dropdownShowing);
            setSearchString(string);
        if(string.length>=5){
        const foundCustomer = await axios({
            method:'get',
            url:`https://criptopass.com/bridge/customers/find/${string}`,
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
                console.log('SEARCH ITEMS: ', data);
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
            if(destinyAlias !==''){       
                const response = await axios({
                    method:'post',
                    url:'https://criptopass.com/bridge/customers/destinatarios',
                    data:{
                        destiny_external_account_id:selectedItem.external_account_id,
                        destiny_customer_id:selectedItem.id,
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
            } else {
                toast.update(notificationId,{render:'Es necesario asignar un Alias al destinatario antes de agregarlo!',type:'error',isLoading:false});
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
            <div className='flex max-sm:flex-col justify-start items-center gap-10'>
                <div>
                    <h3 className='text-[20px] text-primary font-openSauce font-bold'>Buscar destinatario por email address</h3>
                    <input type='text' placeholder='Escribe la dirección de email' value={searchString} onChange={(e)=>handleSearch(e.target.value)}
                    className={`border-secondary border-2 rounded-sm w-full`}
                    />
                    {searchItems.length > 1 ?
                    <div>
                    <input className={`${selectedItem.account_number ? 'block bg-green-400' : 'hidden'} w-full`} readOnly={true} value={(!selectedItem.first_name && !selectedItem.last_name) ? selectedItem : selectedItem.account_owner_name  + ' - '+selectedItem.bank_name + ' - ' + (selectedItem.routing_number===null ? selectedItem.bic : selectedItem.routing_number)} />
                    <select value={selectedItem} onChange={(e)=>setSelectedItem(JSON.parse(e.target.value))}>
                        {searchItems.map((item, index)=>{
                            return (
                                <option key={index} value={JSON.stringify(item)}
                                className={`font-garet`}
                                
                                >
                                    {(!item.first_name && !item.last_name) ? item : item.account_owner_name + ' - '+item.bank_name+ ' - ' + (item.routing_number===null ? item.bic : item.routing_number)}
                                </option>
                            )
                        })}
                    </select> 
                    </div>:
                    <button readOnly={true} className={`text-left w-full ${selectedItem.account_number ? 'bg-green-400' : ''}`} value={searchItems[0]} onClick={()=>setSelectedItem(searchItems[0])}>{searchItems.length>0 ? searchItems[0].account_owner_name + ' - '+ searchItems[0].bank_name + ' - ' + (searchItems[0].routing_number===null ? searchItems[0].bic : searchItems[0].routing_number) : ''}</button>
                    }
                </div>
                <div>
                    <label className='text-[20px] text-primary font-openSauce font-bold'>Asignar un alias/nickname al destinatario</label><br/>
                    <input className='border-secondary border-2 rounded-sm'
                    type='text' placeholder='Mi propia cuenta/Cuenta de mi BFF/Cuenta del proveedor 1' value={destinyAlias} onChange={(e)=>setDestinyAlias(e.target.value)} required={true} />
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