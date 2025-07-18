import React, { useState } from 'react';
import api from '../utils/api';
import { axis, hdfc, icici, pnb, sbi } from '../assets';

const banks = [
  { name: 'State Bank of India', description: 'State Bank of India is the largest public sector bank in India.', logo: sbi },
  { name: 'Punjab National Bank', description: 'Punjab National Bank is a leading public sector bank in India.', logo: pnb },
  { name: 'HDFC Bank', description: 'HDFC Bank is a major private sector bank in India.', logo: hdfc },
  { name: 'ICICI Bank', description: 'ICICI Bank is a prominent private sector bank in India.', logo: icici },
  { name: 'Axis Bank', description: 'Axis Bank is a well-known private sector bank in India.', logo: axis },
];

const Bank = () => {
    const [selectedBank, setSelectedBank] = useState(null);
  const [formData, setFormData] = useState({
    ifscCode: '',
    accountHolder: '',
    accountAddress: '',
    accountType: '',
    amount: 0,
  });
  // JFDS4435
  // 573950000342536
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankSelection = (bank) => {
    setSelectedBank(bank);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/bank/add`, { ...formData, bankName: selectedBank.name });
      alert('Bank details added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding bank details');
    }
  };
  return (
    <div>
        <div className="min-h-screen  text-white flex items-center justify-center p-10">
      <div className="w-full max-w-4xl bg-zinc-800 border-zinc-700 border-[1px] rounded-lg shadow-lg p-6 flex">
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4 text-amber-400">Select Bank</h2>
          <div className="space-y-4">
            {banks.map((bank) => (
              <button
                key={bank.name}
                onClick={() => handleBankSelection(bank)}
                className={`w-full py-3 px-4 rounded-lg transition-colors ${
                  selectedBank?.name === bank.name ? 'bg-amber-600' : 'bg-zinc-700 border-zinc-800 border-[1px]'
                }`}
              >
                <div className="flex items-center">
                  <img src={bank.logo} alt={bank.name} className="h-8 w-8 mr-4" />
                  <span>{bank.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-1/2 p-6">
          {selectedBank ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">{selectedBank.name}</h2>
              <p className="mb-4">{selectedBank.description}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ifscCode" className="block mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="accountHolder" className="block mb-2">Account Holder</label>
                  <input
                    type="text"
                    name="accountHolder"
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="accountAddress" className="block mb-2">Account Address</label>
                  <input
                    type="text"
                    name="accountAddress"
                    id="accountAddress"
                    value={formData.accountAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="accountType" className="block mb-2">Account Type</label>
                  <input
                    type="text"
                    name="accountType"
                    id="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Bank Details
                </button>
              </form>
            </>
          ) : (
            <p className="text-center text-zinc-500">Please select a bank to proceed.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Bank