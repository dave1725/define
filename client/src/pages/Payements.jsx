import React, { useEffect, useState } from 'react';
import Pay from '../components/Pay';
import Request from './Request';
import Reqpay from '../components/Reqpay';
import Moralis from 'moralis';
import { useAddress, useBalance } from '@thirdweb-dev/react';
import { FiArrowUp } from 'react-icons/fi';
import axios from 'axios';


const Payements = () => {
    const [active, setActive] = useState("upi");
    const [USDC, setUSDC] = useState(0);
    const [userUSDC, setUserUSDC] = useState(0);
    const [userDAI, setUserDAI] = useState(0);
    const [DAI, setDAI] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [state, setState] = useState();

    const [history, setHistory] = useState([
        // { date: '15/6/2024', token: 'USDC', loan: '10', pl: '+1.1' },
    ]);
    const [connected, setConnected] = useState('');


    const wallet = useAddress();

    const { data: userUSDCBalance, isLoading: loadingUSDCToken } = useBalance("0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8");
    const { data: userDAIBalance, isLoading: loadingDAIToken } = useBalance("0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357");

    useEffect(() => {
        const init = async () => {
            try {
                if (loadingUSDCToken) {
                    setUserUSDC(0);
                }
                else {
                    setUserUSDC(`${userUSDCBalance.displayValue}`);
                    const response = await Moralis.EvmApi.token.getTokenPrice({
                        "chain": "0x1",
                        "include": "percent_change",
                        "exchange": "uniswapv3",
                        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    });

                    console.log(response.raw.usdPrice);
                    setUSDC(response.raw.usdPrice);
                }
            } catch (error) {
                console.log(error);
            }
        }
        init();
    }, [loadingUSDCToken, wallet])

    useEffect(() => {
        if (!wallet) {
            setConnected(false);
        } else {
            setConnected(true);
            axios.post("http://localhost:5550/pay/paymentRead", { sender: wallet })
                .then((res) => {
                    const obj = res.data;
                    console.log(res.data);

                    // Create a new array to store updated history
                    const updatedHistory = obj.map((item) => {
                        const date = new Date(item.date);
                        const d = date.getDate();
                        const m = date.getMonth() + 1;
                        const y = date.getFullYear();
                        return { date: `${d}/${m}/${y}`, to: item.toUPI, keyword: item.keyword, amount: item.amount, coin: item.coin, address: item.sender };
                    });
                    

                    // Update the history state with the new array
                    setHistory(updatedHistory);
                })
                .catch((err) => {
                    alert("Failed to fetch loan history");
                });
        }
    }, [wallet]);

    useEffect(() => {
        const init = async () => {
            try {
                // await Moralis.start({
                //     apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijc0MzU1NDE4LTZmNTUtNGRiZi04M2E5LTg0YmVmMWU2ZTg3ZSIsIm9yZ0lkIjoiMzk4MDY1IiwidXNlcklkIjoiNDA5MDI2IiwidHlwZUlkIjoiNmNiZGM1ZWItMTE0MS00Nzg4LWExZDItM2FkZjk3MWI2MzA0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTk1MDI5NjAsImV4cCI6NDg3NTI2Mjk2MH0.AJXjaSjXiJSpmYFfjFwkbK06cEcMdjHzq3b1fu3PHwQ"
                // });
                if (loadingDAIToken) {
                    setUserDAI(0);
                }
                else {
                    setUserDAI(`${userDAIBalance.displayValue}`);
                    const resp = await Moralis.EvmApi.token.getTokenPrice({
                        "chain": "0x1",
                        "include": "percent_change",
                        "exchange": "uniswapv3",
                        "address": "0x6b175474e89094c44da98b954eedeac495271d0f"
                    });

                    console.log(resp.raw);
                    setDAI(resp.raw.usdPrice);
                }
            } catch (error) {
                console.log(error);
            }
        }
        init();
    }, [loadingDAIToken, wallet])


    const toggleHandler = (paymentType) => {
        setActive(paymentType);
    }

    return (
        <div className='flex flex-col bg-black w-full text-white border-t h-screen'>
            <div className="mt-6 ml-10 w-[650px] bg-zinc-900 border-zinc-700 border-[1px] p-6 rounded-lg shadow-lg">
                <p className="text-lg">Available USDC Balance: {Number(USDC * userUSDC * 83).toFixed(2)} INR</p>
                <p className="text-lg">Available DAI Balance: {Number(DAI * userDAI * 83).toFixed(2)} INR</p>
                {/* <p onClick={() => setRefresh(true)} className='text-lg text-green-300 cursor-pointer'><em>refresh</em></p> */}
            </div>
            <div className='w-full flex px-8 py-4 gap-10 text-xl'>
                <div
                    onClick={() => toggleHandler("upi")}
                    className={`w-full flex justify-center border p-4 rounded-full ${active === "upi" ? 'bg-fadeBlue text-black' : 'bg-boxbg'} hover:bg-fadeBlue hover:text-black`}
                >
                    Pay
                </div>
                <div
                    onClick={() => toggleHandler("metamask")}
                    className={`w-full flex justify-center border p-4 rounded-full ${active === "metamask" ? 'bg-fadeBlue text-black' : 'bg-boxbg'} hover:bg-fadeBlue hover:text-black`}
                >
                    Requests
                </div>
            </div>
            <div className='h-full flex justify-center gap-10'>
                {active === "upi" && (
                    <>
                    <Pay />
                    <div className="bg-zinc-900  p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">Date</th>
                                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">To</th>
                                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">Keyword</th>
                                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">Amount</th>
                                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">Coin</th>
                                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">Address</th>
                            </tr>
                        </thead>
                        {connected && (
                            <tbody>
                                {history.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="border-b border-zinc-700 p-3">{entry.date}</td>
                                        <td className="border-b border-zinc-700 p-3">{entry.to}</td>
                                        <td className="border-b border-zinc-700 text-yellow-500 p-3">{entry.keyword}</td>
                                        <td className="border-b border-zinc-700 p-3 text-green-500">
                                            <div className="flex ">
                                                <FiArrowUp size={24} />
                                                <div>{entry.amount}</div>
                                            </div>
                                        </td>
                                        <td className="border-b border-zinc-700 p-3">{entry.coin}</td>
                                        <td className="border-b border-zinc-700 p-3">{(entry.address).slice(0,4)} ... {(entry.address).slice(37,-1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                        {!connected && (
                            <p>Connect your wallet!!</p>
                        )}
                    </table>
                </div>
                </>
                )}
                {active === "metamask" && <Request />}
                
            </div>

        </div>
    )
}

export default Payements;
