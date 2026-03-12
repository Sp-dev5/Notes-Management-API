import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errors.js';
import { CreateNoteInput, UpdateNoteInput } from '../utils/validation.js';

const prisma = new PrismaClient();

interface FetchNotesOptions {
  userId?: string;
  page?: number;
  limit?: number;
  isAdmin?: boolean;
}

export async function createNote(userId: string, input: CreateNoteInput) {
  const note = await prisma.note.create({
    data: {
      title: input.title,
      content: input.content,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return note;
}

export async function fetchNotes({
  userId,
  page = 1,
  limit = 10,
  isAdmin = false,
}: FetchNotesOptions) {
  const skip = (page - 1) * limit;

  const whereCondition = isAdmin ? {} : { userId };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.note.count({ where: whereCondition }),
  ]);

  return {
    notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getNoteById(noteId: string, userId: string, isAdmin: boolean = false) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (!isAdmin && note.userId !== userId) {
    throw new ApiError(403, 'Forbidden');
  }

  return note;
}

export async function updateNote(
  noteId: string,
  userId: string,
  input: UpdateNoteInput,
  isAdmin: boolean = false
) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (!isAdmin && note.userId !== userId) {
    throw new ApiError(403, 'Forbidden');
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedNote;
}

export async function deleteNote(
  noteId: string,
  userId: string,
  isAdmin: boolean = false
) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (!isAdmin && note.userId !== userId) {
    throw new ApiError(403, 'Forbidden');
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  return { message: 'Note deleted successfully' };
}

export async function searchNotes(
  query: string,
  userId: string,
  isAdmin: boolean = false,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  
  // For SQLite, we use case-insensitive LIKE by default
  const whereCondition = {
    ...(isAdmin ? {} : { userId }),
    OR: [
      {
        title: {
          contains: query,
        },
      },
      {
        content: {
          contains: query,
        },
      },
    ],
  };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.note.count({ 
      where: whereCondition
    }),
  ]);

  return {
    notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
