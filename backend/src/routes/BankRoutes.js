import express from 'express';
import { addBankDetails, getAllUsers } from '../controllers/bankcontoller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getLoggedUserDetails } from '../controllers/bankcontoller.js';

const router = express.Router();

router.post('/add',authMiddleware, addBankDetails);
router.get('/all-users',authMiddleware, getAllUsers);
router.get('/user-details',authMiddleware, getLoggedUserDetails);

export default router;