import { Router } from 'express';
import { getCategory } from '../controllers/categoryController';

const router = Router();

router.get("/getCategory", getCategory);

export default router;
