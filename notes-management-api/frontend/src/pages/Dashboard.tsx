import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/Header';
import { NoteCard } from '../components/NoteCard';
import { NoteEditor } from '../components/NoteEditor';
import { Plus, Loader } from 'lucide-react';
import { useNotes, useDeleteNote, useCreateNote, useUpdateNote, useSearchNotes } from '../hooks/useNotes';
import { Note } from '../utils/types';

export function DashboardPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: notesData, isLoading, isError } = useSearchQuery(searchQuery, page);
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote(selectedNote?.id || '');
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const openEditor = (note?: Note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedNote(undefined);
  };

  const handleSave = (data: { title: string; content: string }) => {
    if (selectedNote) {
      updateNote(data, { 
        onSuccess: closeEditor,
        onError: (error: any) => {
          console.error('Error updating note:', error);
          alert('Failed to update note: ' + (error?.response?.data?.error || error?.message || 'Unknown error'));
        }
      });
    } else {
      createNote(data, { 
        onSuccess: closeEditor,
        onError: (error: any) => {
          console.error('Error creating note:', error);
          alert('Failed to create note: ' + (error?.response?.data?.error || error?.message || 'Unknown error'));
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <MainLayout>
      <Header onSearch={handleSearch} />

      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold gradient-text">My Notes</h1>
            <button
              onClick={() => openEditor()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              New Note
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin text-primary-500" size={40} />
            </div>
          ) : isError ? (
            <div className="glass-lg rounded-2xl p-8 text-center border-2 border-red-500/40">
              <p className="text-red-400 font-medium">Failed to load notes. Please try again.</p>
            </div>
          ) : notesData?.notes && notesData.notes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {notesData.notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={openEditor}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>

              {/* Pagination */}
              {notesData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4">
                    Page {page} of {notesData.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(notesData.pagination.totalPages, page + 1))}
                    disabled={page === notesData.pagination.totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="glass-lg rounded-2xl p-12 text-center border-2">
              <p className="text-slate-300 mb-4">
                {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
              </p>
              <button onClick={() => openEditor()} className="btn-primary">
                <Plus size={18} className="inline mr-2" />
                Create First Note
              </button>
            </div>
          )}
        </div>
      </div>

      <NoteEditor
        note={selectedNote}
        isOpen={editorOpen}
        onClose={closeEditor}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
      />
    </MainLayout>
  );
}

function useSearchQuery(query: string, page: number) {
  const { data: searchData, isLoading: isSearching } = useSearchNotes(query, page, 10);
  const { data: notesData, isLoading: isLoadingNotes } = useNotes(page, 10);

  return {
    data: query ? searchData : notesData,
    isLoading: query ? isSearching : isLoadingNotes,
    isError: false,
  };
}
