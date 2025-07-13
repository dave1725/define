import React, { useState } from 'react'
import { GrRadial } from "react-icons/gr";
import { GrRadialSelected } from "react-icons/gr";
import Pay from "./Pay.jsx";

const Reqpay = () => {
    const [paytoggle, setPaytoggle] = useState(false);
    const [paythrough, setPaythrough] = useState("metamask");
    const payHandler = () => {
        setPaytoggle(true);
    }
    const closeHandler = () => {
        setPaytoggle(false);
    }
    const paythroughHandler = (type) => {
        setPaythrough(type);
    }
    return (
        <>
            <p className='text-lg text-green-500'><strong>OUTGOING REQUESTS</strong></p><br></br>
            <button onClick={payHandler} className=' rounded-full p-5 bg-icon text-black w-[200px] h-[60px]'>Request</button><br></br>
            <br></br>
            <div className='flex justify-between items-center w-full border-2 border-zinc-400 rounded-lg bg-boxbg p-8'>
                    <p className='text-green-400 flex items-center font-bold text-2xl'>+700</p>
                <div className=' flex flex-col justify-center'>
                    <p className='text-sm text-stone-400 inset-x-0 bottom-0 font-medium'>Name</p>
                    <p className='text-sm text-stone-400 inset-x-0 bottom-0 font-medium'>7066661607@upi</p>
                </div>
                <button onClick={payHandler} className=' rounded-full p-5 bg-icon text-black w-24 h-full'>status</button>
                
            </div><br></br>
            <p className='text-lg text-green-500'><strong>INCOMING REQUESTS</strong></p><br></br>
            <div className='flex justify-between items-center w-full border-2 border-zinc-400 rounded-lg bg-boxbg p-8'>
                    <p className='text-red-400 flex items-center font-bold text-2xl'>-700</p>
                <div className=' flex flex-col justify-center'>
                    <p className='text-sm text-stone-400 inset-x-0 bottom-0 font-medium'>Name</p>
                    <p className='text-sm text-stone-400 inset-x-0 bottom-0 font-medium'>7066661607@upi</p>
                </div>
                <button onClick={payHandler} className=' rounded-full p-5 bg-icon text-black w-24 h-full'>Pay</button>
                {paytoggle && (
                    <div className='h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm'>
                        <p className="cursor-pointer" onClick={()=>setPaytoggle(false)}>close</p>
                        <Pay />
                    </div>
                )}
            </div>
        </>
    )
}

export default Reqpay