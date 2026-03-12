import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
} from '../controllers/notesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All note routes require authentication
router.use(authMiddleware);

router.post('/', createNote);
router.get('/search', searchNotes);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
