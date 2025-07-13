import React from 'react'
import UserProfile from '../components/UserProfile';
import { Link } from "react-router-dom";
import ScratchCard from '../components/Scratch';
import img from "../../public/card.jpg"

const Test = () => {
    
  return (
    <div className='flex h-screen gap-3 p-7'>
        <div className='text-white flex flex-col gap-4 bg-boxbg rounded-3xl border-2 w-3/4 h-5/6'>
            <div className='border-b w-full h-1/5 p-6 flex justify-around'>
                <div className='rounded-3xl border p-4'> 
                    <p className='font-bold text-gray-300'>Cashback earned: <span className='font-thin'> $40</span></p>
                    <Link to="/" className='text-fadeBlue'>withdraw</Link>
                </div>
                <div className='flex flex-col rounded-3xl border p-4'> 
                <p className='font-bold text-gray-300'>Total Coupons earned</p>
                <p className='font-thin text-lg'>10</p>
                </div>
            </div>
            <div className='w-full h-4/5 p-5'>
            <ScratchCard
                width={200}
                height={250}
                // image="https://hips.hearstapps.com/hmg-prod/images/2024-lamborghini-revuelto-127-641a1d518802b.jpg?crop=0.813xw:0.721xh;0.0994xw,0.128xh&resize=1200:*"
                image={img}
                brushSize={60}
            />
            </div>
        </div>
        <div className='flex flex-col text-white p-5 bg-boxbg rounded-3xl border-2 w-1/4 h-5/6'>
            <UserProfile />
        </div>
    </div>
  )
}

export default Test