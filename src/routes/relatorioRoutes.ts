import { Router } from 'express';
import { create } from '../controllers/relatorioController';

const router = Router();

router.post("/:periodo", create);

export default router;
