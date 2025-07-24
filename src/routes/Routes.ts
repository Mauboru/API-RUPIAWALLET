import { Router } from "express";
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/auth", authRoutes);

export default router;  