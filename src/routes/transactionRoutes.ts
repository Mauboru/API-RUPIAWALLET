import { Router } from 'express';
import { newTransaction, getTransactions, getTransactionsByMonth } from '../controllers/transactionController';

const router = Router();

router.post("/newTransaction", newTransaction);
router.get("/getTransactions", getTransactions);
router.get("/getTransactionsByMonth/:month", getTransactionsByMonth);

export default router;
