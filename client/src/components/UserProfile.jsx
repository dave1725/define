import React, { useState, useEffect } from 'react'
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import Cookies from "js-cookie"
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { verifyUPI } from 'bhimupijs';
import { useAddress, ConnectWallet } from '@thirdweb-dev/react';

const UserProfile = () => {
  const [upiId, setUpiId] = useState("");
  const [metamaskId, setMetamaskId] = useState("");
  const [linked, setLinked] = useState(false);

  const [name, setName] = useState("bhowmik");
  const [email, setEmail] = useState("Bhowmik@gmail.com");
  const [mob, setMob] = useState("sdfasd");
  const [age, setAge] = useState("21");
  const [dob, setDob] = useState("324");
  const [address, setAddress] = useState("chandil");
  const [status, setStatus] = useState("sti");
  const [diamPublic, setDIAM] = useState('');
  const [box, setBox] = useState(false);

  const wallet = useAddress();

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const response = await verifyUPI(upiId);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Error:', error.message);
  //     }
  //   }
  //   init();
  // }, [upiId])
  useEffect(() => {
    try {
      const USER = async () => {
        const res = await axios.post(
          `http://localhost:5550/api/auth/fetchdetail`,
          { email: "praveen@gmail.com" }
        );
        const details = await res.data.user;
        setName(details.name);
        setEmail(details.email);
        setMob(details.mobile);
        setAge(details.age);
        setDob(details.dob);
        setAddress(details.address);
        setStatus(details.status);
        setUpiId(details.upiId);
        setMetamaskId(details.metamaskId);
        setDIAM(details.diamPublic);
        localStorage.setItem("diam",details.diamPrivate);
        if(details.metamaskId){
          setLinked(true);
        }
        setMetamaskId(wallet);
        console.log(wallet);
        console.log(status);
      };
      USER();
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  // Function to generate OTP 
  const generateOTP = () => {
    let digits =
      '0123456789';
    let OTP = '';
    let len = digits.length;
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  }

  // link the id's
  const linkingHandler = async () => {
    try {
      const response = await verifyUPI(upiId);
      if(!response.isQueryPatternValid) {
        console.log(response);
        const otp = generateOTP();
        alert("OTP sent to your phone number associated with the UPI ID");
        alert("OTP: " + otp);
        const ans = prompt("Enter OTP");
        if(ans === otp){
          alert("OTP verified!");
          const links = await axios.post(
            `http://localhost:5550/api/auth/linking`,
            { email: "praveen@gmail.com", upi: upiId, metamask: metamaskId }
          );
          setLinked(true);
          console.log(links);
        }
        else{
          alert("Verification failed!");
        }
      }
      else{
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
      alert('linking failed');
    }
  };

  const logoutHandler = () => {
    Cookies.remove('token');
    window.location.href = '/';
  }

  const togglebox = () => {
    setBox(!box);
  }

  const update = async () => {
    try {
      const res = await axios.post(`http://localhost:5550/api/auth/updatedet`, { name, email, mob, age, dob, address, status });
      console.log(res.data);
      console.log("success");
      setBox(!box);
    } catch (error) {
      console.log(error);
    }
  }

  const fundDIAM = async () => {
    try {
      const res = await axios.post("http://localhost:5550/fund-account",{
        "publicKey": diamPublic,
      })
      if(res){
        alert("Funding of 10 DIAMS Successfull")
      }
    } catch (error) {
      return alert("Failed to fund"); 
    }
  }

  return (
    <>
      <div className='relative h-[100vh]'>
        <FaEdit onClick={togglebox} className='absolute text-xl text-fadeBlue' />
        <div className='p-4 flex-1 flex flex-col'>
          <div className='text-8xl flex flex-col justify-center items-center gap-2 mb-12'>
            <FaCircleUser className='text-fadeBlue' />
            <p className='text-3xl flex text-gray-300 justify-center items-center'>{name}</p>
          </div>
          <ConnectWallet />
          <div className='flex flex-col  h-full'>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>Email: </p><span className='text-white text-zinc-300 text-base px-2'>{email}</span></div>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>Mobile: </p><span className='text-white text-zinc-300 text-base px-2'>{mob}</span></div>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>Age: </p><span className='text-white text-zinc-300 text-base px-2'>{age}</span></div>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>DOB: </p><span className='text-white text-zinc-300 text-base px-2'>{dob}</span></div>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>State: </p><span className='text-white text-zinc-300 text-base px-2'>{address}</span></div>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>Marital-Status: </p><span className='text-white text-zinc-300 text-base px-2'>{status}</span></div>
            <div className='flex'><p className='font-bold text-gray-300 text-base'>DIAM Address: </p><span className='text-white text-zinc-300 text-base px-2'>{diamPublic.slice(0,4)} ... {diamPublic.slice(50,56)}</span></div>
            {diamPublic && (
              <>
                <p onClick={() => fundDIAM()} className='cursor-pointer text-green-400 underline'>fund diam</p>
              </>
            )}
          </div>
          <div className='pt-2 mt-2 border-t w-full rounded-md h-full p-4 flex flex-col gap-1'>
            { linked ? (
              <>              
              <button className='mr-auto bg-fadeBlue rounded-md px-4 py-1 text-black w-1/2'>Linked</button>
              <p onClick={() => setLinked(false)} className='cursor-pointer text-green-400 underline'>update?</p>
              </>
            ) : (
              <>
              <button onClick={linkingHandler} className='bg-fadeBlue rounded-md px-4 py-1 text-black w-1/4'>Link</button>
            <div className='flex flex-col '>
              <label className='font-bold text-gray-300 text-base'>Metamask Id: </label>
              <input
                type="text"
                value={metamaskId}
                onChange={(e) => {
                  setMetamaskId(e.target.value);
                }}
                placeholder="Metamask Id"
                className='bg-boxbg text-black border outline-none rounded-md  px-2 py-1 text-gray-200'
              />
              <label className='font-bold text-gray-300 text-base'>Upi Id: </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                }}
                placeholder="Upi Id"
                className='bg-boxbg border outline-none rounded-md  px-2 py-1 text-gray-200'
              />
            </div>
            </>
            )}
          </div>
        </div>

        {/* down box */}
        <div className='p-4 border-t flex flex-col items-center h-1/3'>
          <Link to="/bank" className='text-linkcolor'>Complete KYC</Link>
          <p className='text-linkcolor'>Change password</p>
          <p className='text-linkcolor'>Show QR</p>
          <p className='text-linkcolor'>Remainders</p>
          <button onClick={logoutHandler} className='text-black py-2 bg-fadeBlue rounded-md border w-full '>Logout</button>
        </div>

      </div>

      {box &&
        <div className='absolute flex flex-col gap-2 p-5 left-[30%] w-2/5 h-2/4 bg-neutral-800 border-2 rounded-md'>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            className='py-2 px-2 bg-zinc-700 outline-none rounded-md'
          />
          <input
            type="text"
            placeholder="Mobile"
            onChange={(e) => setMob(e.target.value)}
            className='py-2 px-2 bg-zinc-700 outline-none rounded-md'
          />
          <input
            type="text"
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
            className='py-2 px-2 bg-zinc-700 outline-none rounded-md'
          />
          <input
            type="text"
            placeholder="Dob"
            onChange={(e) => setDob(e.target.value)}
            className='py-2 px-2 bg-zinc-700 outline-none rounded-md'
          />
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            className='py-2 px-2 bg-zinc-700 outline-none rounded-md'
          />
          <input
            type="text"
            placeholder="Status"
            onChange={(e) => setStatus(e.target.value)}
            className='py-2 px-2 bg-zinc-700 outline-none rounded-md'
          />
          <button onClick={update} className='w-full bg-fadeBlue rounded-md py-2'>Save Changes</button>
        </div>

      }
    </>
  )
}

export default UserProfile