import { Router } from 'express';
import { getCategory, newCategory, deleteCategory, updateCategory } from '../controllers/categoryController';

const router = Router();

router.get("/getCategory", getCategory);
router.post("/newCategory", newCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
