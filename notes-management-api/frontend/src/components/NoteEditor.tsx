import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Note } from '../utils/types';
import { FormField } from './FormField';

interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string }) => void;
  isLoading?: boolean;
}

export function NoteEditor({
  note,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: NoteEditorProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
      });
    } else {
      setFormData({ title: '', content: '' });
    }
    setErrors({});
  }, [note, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary-500/40">
        <div className="flex items-center justify-between p-6 border-b border-primary-500/20">
          <h2 className="text-2xl font-bold gradient-text">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-500/20 rounded-lg text-slate-300 hover:text-primary-200 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="Enter note title"
          />

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-100">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter note content"
              className="w-full px-4 py-3 bg-slate-950/40 backdrop-blur-lg border border-primary-500/30 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium h-64 resize-none"
            />
            {errors.content && (
              <p className="mt-2 text-red-400 text-sm">{errors.content}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
