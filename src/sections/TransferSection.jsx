import React, {useState,useEffect} from 'react';


const TransferSection = ()=>{

    const [fromAddress,setFromAddress] = useState('');
    const [liquidAmount,setLiquidAmount] = useState(0.00);
    const [developerFee,setDeveloperFee] = useState(0.025);
    const [transferCost, setTransferCost] = useState(0.00);

    return (
        <div>
            <div>
                <h3 className='text-[25px] text-secondary font-bold font-openSauce'>Aspectos a considerar antes de empezar el proceso de transferencia</h3>
                <ol className='list-decimal text-primary font-bold'>
                    <li>La cuenta Destino ya debe estar registrada en Criptopass y debes tenerla agregada en destinatarios.</li>
                    <li>Tener una cuenta verificada en Binance</li>
                    <li>La transferencia se realizará a través de la red Ethereum</li>
                    <li>Tener como minimo 26 USDT (20 es el monto mínimo de transferencia, 6 es el fee fijo de Binance por transferencia a través de red crypto) en tu billetera Spot. Criptopass te cobrará una comisión de 2.5% por el monto, por lo cual deberás hacer la transferencia por el monto que deseas transferir más la comisión de Criptopass:
                        Monto deseado a transferir: 20 USDT.
                        Fee de Binance: 6 USDT.
                        Fee de CriptoPass: 0.5 USDT
                        Monto total a transferir a través de Criptopass: 20.5 USDT
                    </li>
                    <li>Cada tipo de transferencia tiene un costo particular. A continuación los costos:
                        <ul>
                        <li>ACH: $0.50</li>
                        <li>Same Day ACH: $1</li>
                        <li>Wire: $20</li>
                        </ul>
                    </li>
                </ol>
            </div>
            <div className='my-4'>
                <h2 className='text-[25px] text-secondary font-bold font-openSauce'>Iniciar Proceso de Transferencia</h2>
                <p className='font-garet text-primary text-[20px]'>Por favor rellena los siguientes campos para que podamos iniciar la transferencia:</p>
                <div className='flex flex-col justify-start items-start gap-4'>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Datos de origen</h3>
                        <div className='flex justify-start items-center gap-4'>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Dirección Billetera Spot de Binance (en Ethereum):</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='0xe15804194f8ced608d950eca9a2d421ef54a961d' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/>
                            </div>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Monto líquido que desea que llegue a destino:</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='20.00' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/>
                            </div>

                        </div>
                    </div>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Datos de Destino</h3>
                        <div className='flex justify-start items-center gap-4'>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Dirección Billetera Spot de Binance (en Ethereum):</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='0xe15804194f8ced608d950eca9a2d421ef54a961d' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/>
                            </div>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Monto a transferir en USDT</label><br/>
                                <input
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' required={true} placeholder='20.00' value={fromAddress} onChange={(e)=>setFromAddress(e.target.value)}/>
                            </div>

                        </div>
                    </div>
                    <div className='py-4 px-4 bg-tertiary w-full'>
                        <h3 className='text-[20px] font-bold font-openSauce text-secondary'>Costos relacionados</h3>
                        <div className='flex justify-start items-center gap-4'>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Costo de la transferencia:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm text'
                                type='text' value={fromAddress}/>
                            </div>
                            <div className='w-[50%]'>
                                <label className='font-bold'>Comision de Criptopass:</label><br/>
                                <input disabled={true}
                                className='w-full border-secondary border-2 rounded-sm'
                                type='text' value={`${developerFee*100} %`}/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default TransferSection;