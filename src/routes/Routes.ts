import { Router } from "express";
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import authRoutes from './authRoutes';
import relatorioRoutes from './relatorioRoutes';

const router = Router();

router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/auth", authRoutes);
router.use("/relatorio", relatorioRoutes);

export default router;  