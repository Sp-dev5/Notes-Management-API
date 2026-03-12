import { Response } from 'express';
import { createNoteSchema, updateNoteSchema } from '../utils/validation.js';
import * as notesService from '../services/notesService.js';
import { AuthRequest } from '../middleware/auth.js';
import { successResponse } from '../utils/errors.js';

export async function createNote(req: AuthRequest, res: Response) {
  const input = createNoteSchema.parse(req.body);
  const note = await notesService.createNote(req.userId!, input);

  res.status(201).json(
    successResponse(note, 'Note created successfully')
  );
}

export async function getNotes(req: AuthRequest, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const isAdmin = req.userRole === 'ADMIN';

  const result = await notesService.fetchNotes({
    userId: isAdmin ? undefined : req.userId,
    page,
    limit,
    isAdmin,
  });

  res.status(200).json(
    successResponse(result, 'Notes retrieved successfully')
  );
}

export async function getNoteById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const isAdmin = req.userRole === 'ADMIN';

  const note = await notesService.getNoteById(id, req.userId!, isAdmin);

  res.status(200).json(
    successResponse(note, 'Note retrieved successfully')
  );
}

export async function updateNote(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const input = updateNoteSchema.parse(req.body);
  const isAdmin = req.userRole === 'ADMIN';

  const note = await notesService.updateNote(id, req.userId!, input, isAdmin);

  res.status(200).json(
    successResponse(note, 'Note updated successfully')
  );
}

export async function deleteNote(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const isAdmin = req.userRole === 'ADMIN';

  await notesService.deleteNote(id, req.userId!, isAdmin);

  res.status(204).send();
}

export async function searchNotes(req: AuthRequest, res: Response) {
  const { q: query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const isAdmin = req.userRole === 'ADMIN';

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }

  const result = await notesService.searchNotes(query, req.userId!, isAdmin, page, limit);

  res.status(200).json(
    successResponse(result, 'Search completed successfully')
  );
}
