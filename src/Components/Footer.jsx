import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';

import logoSVG from '../img/criptopass.svg';


const Footer = ()=>{

    {/*const [myIp,setMyIp] = useState('');
    useEffect(()=>{
        const getIpAddress = async ()=>{
            const {data} = await axios({
                method:'get',
                url:'https://api.ipify.org/?format=json',
                headers:{
                    'Content-Type':'application/json'
                }
            });
            console.log('IP Address: ', data.ip);
    };
    getIpAddress();
    },[]); */}

    return (
        <div className='footer min-h-[300px] py-[10px] px-[15px] bg-secondary flex max-lg:flex-col lg:flex-wrap justify-evenly max-lg:justify-start items-center max-lg:items-start max-lg:gap-8'>
            <div className='w-[100px] h-[100px]'>
                <img src={logoSVG}/>
            </div>
            <div>
                <Link className='text-white font-garet text-[20px] hover:text-primary'>Política de Privacidad</Link>
            </div>
            <div>
                <Link className='text-white font-garet text-[20px] hover:text-primary'>Términos y Condiciones</Link>
            </div>
            <div>
                <Link className='text-white font-garet text-[20px] hover:text-primary'>Contáctanos</Link>
            </div>
            <div className='flex flex-col justify-start items-start gap-4 max-lg:flex-row'>
                <a href='https://www.facebook.com/cripto.pass' target='_blank'><FaFacebook className='text-primary text-[20px]' /></a>
                <a href='https://www.instagram.com/cripto.pass/' target='_blank'><FaInstagram className='text-primary text-[20px]' /></a>
                <a href='https://linkedin.com/company/criptopass' target='_blank'><FaLinkedin className='text-primary text-[20px]' /></a>
            </div>
        </div>
    )
};

export default Footer;