import { Icon } from '@/components/Icon';
import { Note } from '@/types/notes';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface NoteEditorProps {
  note: Note | null;
  isNewNote: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

export function NoteEditor({
  note,
  isNewNote,
  onSave,
  onDelete,
  onClose,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const titleRef = useRef<TextInput>(null);
  const contentRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isNewNote) {
      // Auto-focus title field for new notes with a slight delay
      setTimeout(() => titleRef.current?.focus(), 400);
    }
  }, [isNewNote]);

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setHasChanges(true);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(true);
  };

  const handleClose = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    if (hasChanges && (title.trim() || content.trim())) {
      // Auto-save if there are changes
      setIsLoading(true);
      try {
        await onSave(title.trim() || 'Untitled Note', content.trim());
      } catch (error) {
        console.error('Failed to save note:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Small delay to allow save to complete
    setTimeout(() => onClose(), 100);
  };

  const handleDelete = () => {
    console.log('Delete button pressed');
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log('Delete confirmed, onDelete exists:', !!onDelete);
            if (onDelete) {
              setIsLoading(true);
              try {
                await onDelete();
                onClose();
              } catch (error) {
                console.error('Delete error:', error);
                Alert.alert('Error', 'Failed to delete note. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-end mb-6">
          <View className="flex-row items-center">
            {!isNewNote && onDelete && (
              <TouchableOpacity
                onPress={() => {
                  console.log('TouchableOpacity pressed');
                  handleDelete();
                }}
                className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3"
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Icon name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              disabled={isLoading}
            >
              <Icon name="close" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Title Input */}
          <View className="mb-2">
            <TextInput
              ref={titleRef}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="Note title"
              placeholderTextColor="#9ca3af"
              className="text-lg font-semibold text-slate-900 mb-2"
              multiline
              numberOfLines={2}
              editable={!isLoading}
              style={{ 
                minHeight: 40,
                borderWidth: 0,
              }}
            />
          </View>

          {/* Content Input */}
          <View className="flex-1">
            <TextInput
              ref={contentRef}
              value={content}
              onChangeText={handleContentChange}
              placeholder="Start writing..."
              placeholderTextColor="#9ca3af"
              className="text-base text-slate-700 leading-6"
              multiline
              textAlignVertical="top"
              style={{ 
                minHeight: 300,
                borderWidth: 0,
              }}
              editable={!isLoading}
            />
          </View>
        </ScrollView>

        {/* Optional: Show loading state */}
        {isLoading && (
          <View className="absolute inset-0 bg-white/50 items-center justify-center">
            <Text className="text-slate-600">Saving...</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}