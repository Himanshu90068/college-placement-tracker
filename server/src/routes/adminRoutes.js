import { Router } from 'express';
import { listStudents, exportCsv } from '../controllers/adminController.js';

const router = Router();

router.get('/students', listStudents);
router.get('/export', exportCsv);

export default router;
