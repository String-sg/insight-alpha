import { Note, NoteCreate, NotesState, NoteUpdate } from '@/types/notes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useReducer } from 'react';

// Notes context actions
type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string };

// Notes context functions interface
interface NotesContextFunctions {
  getNotesForPodcast: (podcastId: string) => Promise<Note[]>;
  createNote: (podcastId: string, note: NoteCreate) => Promise<Note>;
  updateNote: (noteId: string, update: NoteUpdate) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<void>;
}

// Combined context interface
interface NotesContextType extends NotesState, NotesContextFunctions {}

// Initial state
const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
};

// Reducer function
function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    default:
      return state;
  }
}

// Create context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Storage key helper
const getStorageKey = (podcastId: string) => `notes_podcast_${podcastId}`;

// Notes provider component
interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Get notes for a specific podcast
  const getNotesForPodcast = useCallback(async (podcastId: string): Promise<Note[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storageKey = getStorageKey(podcastId);
      const notesJson = await AsyncStorage.getItem(storageKey);
      
      if (notesJson) {
        const notes = JSON.parse(notesJson) as Note[];
        dispatch({ type: 'SET_NOTES', payload: notes });
        return notes;
      }
      
      dispatch({ type: 'SET_NOTES', payload: [] });
      return [];
    } catch (error) {
      console.error('Failed to get notes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load notes' });
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create a new note
  const createNote = useCallback(async (podcastId: string, noteData: NoteCreate): Promise<Note> => {
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        podcastId,
        title: noteData.title,
        content: noteData.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const storageKey = getStorageKey(podcastId);
      const existingNotesJson = await AsyncStorage.getItem(storageKey);
      const existingNotes = existingNotesJson ? JSON.parse(existingNotesJson) : [];
      
      const updatedNotes = [...existingNotes, newNote];
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create note' });
      throw error;
    }
  }, []);

  // Update an existing note
  const updateNote = useCallback(async (noteId: string, update: NoteUpdate): Promise<Note> => {
    try {
      const currentNote = state.notes.find(n => n.id === noteId);
      if (!currentNote) {
        throw new Error('Note not found');
      }

      const updatedNote: Note = {
        ...currentNote,
        ...(update.title !== undefined && { title: update.title }),
        ...(update.content !== undefined && { content: update.content }),
        updatedAt: Date.now(),
      };

      const storageKey = getStorageKey(currentNote.podcastId);
      const notesJson = await AsyncStorage.getItem(storageKey);
      const notes = notesJson ? JSON.parse(notesJson) : [];
      
      const updatedNotes = notes.map((note: Note) =>
        note.id === noteId ? updatedNote : note
      );
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update note' });
      throw error;
    }
  }, [state.notes]);

  // Delete a note
  const deleteNote = useCallback(async (noteId: string): Promise<void> => {
    try {
      const noteToDelete = state.notes.find(n => n.id === noteId);
      if (!noteToDelete) {
        throw new Error('Note not found');
      }

      const storageKey = getStorageKey(noteToDelete.podcastId);
      const notesJson = await AsyncStorage.getItem(storageKey);
      const notes = notesJson ? JSON.parse(notesJson) : [];
      
      const updatedNotes = notes.filter((note: Note) => note.id !== noteId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
    } catch (error) {
      console.error('Failed to delete note:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete note' });
      throw error;
    }
  }, [state.notes]);

  const value: NotesContextType = {
    ...state,
    getNotesForPodcast,
    createNote,
    updateNote,
    deleteNote,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

// Custom hook to use notes context
export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
}