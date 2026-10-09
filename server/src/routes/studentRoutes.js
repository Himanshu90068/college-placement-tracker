import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { upsertProfile, getStudent, addAptitudeScore, uploadResume } from '../controllers/studentController.js';

const router = Router();

router.post('/', upsertProfile);
router.get('/:id', getStudent);
router.post('/:id/aptitude', addAptitudeScore);
router.post('/:id/resume', upload.single('resume'), uploadResume);

export default router;
