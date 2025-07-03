import { Router } from 'express';
import { newTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction, getTransactionsByMonth } from '../controllers/transactionController';

const router = Router();

router.post("/newTransaction", newTransaction);
router.get("/getTransactions", getTransactions);
router.get("/getTransactionsByMonth/:month", getTransactionsByMonth);
router.get("/getTransactionById/:id", getTransactionById);
router.put("/updateTransaction/:id", updateTransaction );
router.delete("/deleteTransaction/:id", deleteTransaction );

export default router;
