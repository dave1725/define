import MoneyTransfer from '../models/MoneyTransfer.js';
import BankDetails from '../models/bank.js';

// Create money transfer
export const createMoneyTransfer = async (req, res) => {
  const { senderUPI, receiverUPI, amount, savePercent = 0 } = req.body;

  try {
    // Find sender's bank details
    const senderBankDetails = await BankDetails.findOne({ upiId: senderUPI });
    if (!senderBankDetails) {
      return res.status(404).json({ message: 'Sender bank details not found' });
    }

    // Find receiver's bank details
    const receiverBankDetails = await BankDetails.findOne({ upiId: receiverUPI });
    if (!receiverBankDetails) {
      return res.status(404).json({ message: 'Receiver bank details not found' });
    }

    // Calculate saved amount and transfer amount
    const savedAmount = (amount * savePercent) / 100;
    const transferAmount = amount - savedAmount;

    // Check if sender has sufficient funds
    if (senderBankDetails.amount < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update sender's and receiver's balances and savings
    senderBankDetails.amount -= amount;
    receiverBankDetails.amount += transferAmount;
    senderBankDetails.savings = (senderBankDetails.savings || 0) + savedAmount;

    // Save money transfer details
    const moneyTransfer = new MoneyTransfer({
      sender: senderBankDetails.user,
      senderUPI,
      receiver: receiverBankDetails.user,
      receiverUPI,
      amount: transferAmount,
      savedAmount,
      savePercent,
    });

    await moneyTransfer.save();
    await senderBankDetails.save();
    await receiverBankDetails.save();

    // Respond with success message and transfer details
    res.json({ message: 'Money transfer successful', senderUPI, receiverUPI, transferAmount, savedAmount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get money transfers for current user
export const getMoneyTransfers = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all money transfers involving the current user as either sender or receiver
    const transfers = await MoneyTransfer.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).populate('sender receiver'); // Populate sender and receiver details for more information
    res.json(transfers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};