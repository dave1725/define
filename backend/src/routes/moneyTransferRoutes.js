import express from 'express';
import { createMoneyTransfer, getMoneyTransfers } from '../controllers/moneyTransferController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createMoneyTransfer);
router.get('/', authMiddleware, getMoneyTransfers);

export default router;