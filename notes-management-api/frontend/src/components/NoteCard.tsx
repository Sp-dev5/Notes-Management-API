import React from 'react';
import { Note } from '../utils/types';
import { Edit3, Trash2, Clock } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function NoteCard({ note, onEdit, onDelete, isDeleting }: NoteCardProps) {
  const date = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="glass-lg p-6 h-full flex flex-col hover:shadow-xl hover:shadow-primary-500/30 group cursor-default rounded-lg border-2 border-primary-600/30">
      <div className="flex-1 mb-4">
        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-primary-300 transition-colors">
          {note.title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
          {note.content}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary-500/20">
        <div className="flex items-center text-slate-400 text-xs font-medium gap-1.5">
          <Clock size={13} stroke-width={2.5} />
          <span>{date}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(note)}
            className="p-2.5 hover:bg-primary-600/30 rounded-lg text-primary-300 hover:text-primary-200 transition-all hover:scale-110"
            title="Edit note"
          >
            <Edit3 size={17} stroke-width={2} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            disabled={isDeleting}
            className="p-2.5 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-all hover:scale-110 disabled:opacity-50 disabled:scale-100"
            title="Delete note"
          >
            <Trash2 size={17} stroke-width={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
