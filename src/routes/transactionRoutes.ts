import { Router } from 'express';
import { newTransaction, getTransactions } from '../controllers/transactionController';

const router = Router();

router.post("/newTransaction", newTransaction);
router.get("/getTransactions", getTransactions);

export default router;
