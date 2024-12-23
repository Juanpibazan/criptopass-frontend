import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const RegistroDestinatarios = ()=>{
    const [{activeTitle, user,jwtoken},dispatch] = useStateValue();
    const [activeTab,setActiveTab] = useState('');
    const [dropdownShowing,setDropdownShowing] = useState(false);
    const [searchString,setSearchString] = useState('');
    const [searchItems, setSearchItems] = useState([]);

    const handleSearch = async (string)=>{
        setDropdownShowing(!dropdownShowing);
        setSearchString(string);
        try{
        const foundCustomer = await axios({
            method:'get',
            url:`http://localhost:4000/bridge/customers/find/${string}`,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${jwtoken}`
            }
        });
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
    }catch(e){
            console.log(e);
            toast(e.response.data.msg,{
                type:'error',
                position:'top-center'
            });
    }
    
    };
    
    return (
        <div className='px-4 py-2'>
            <div>
                <div>
                    <h3>Buscar destinatario por email</h3>
                    <input type='text' value={searchString} onChange={(e)=>handleSearch(e.target.value)}
                    className={`border-secondary border-2 rounded-sm`}
                    />
                    <select>
                        {searchItems.map((item, index)=>{
                            return (
                                <option key={index} className={`${!dropdownShowing ? 'hidden' : 'block'}`}>{(!item.first_name && !item.last_name) ? item : item.first_name + ' '+ item.last_name}</option>
                            )
                        })}
                    </select>

                </div>
                <div>

                </div>
            </div>
            <ToastContainer position='top-center' />
        </div>
    )
};

export default RegistroDestinatarios;