/**
 * Note-related type definitions
 */

export interface Note {
  id: string;
  podcastId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteCreate {
  title: string;
  content: string;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
}

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}