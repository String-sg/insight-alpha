import { Icon } from '@/components/Icon';
import { useNotes } from '@/contexts/NotesContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NoteEditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, podcastId } = useLocalSearchParams<{ id: string; podcastId: string }>();
  const { notes, createNote, updateNote, deleteNote, getNotesForPodcast } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const titleRef = useRef<TextInput>(null);
  const contentRef = useRef<TextInput>(null);
  
  const isNewNote = id === 'new';
  const existingNote = notes.find(n => n.id === id);

  useEffect(() => {
    if (podcastId) {
      getNotesForPodcast(podcastId);
    }
  }, [podcastId, getNotesForPodcast]);

  useEffect(() => {
    if (!isNewNote && existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
    } else if (isNewNote) {
      // Auto-focus title field for new notes
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isNewNote, existingNote]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      // Don't save empty notes
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      if (isNewNote) {
        await createNote(podcastId, {
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
        });
      } else {
        await updateNote(id, {
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
        });
      }
      setHasChanges(false);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteNote(id);
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to delete note. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
          { text: 'Save', onPress: handleSave },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setHasChanges(true);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View 
          className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-200"
          style={{ paddingTop: insets.top + 16 }}
        >
          <TouchableOpacity
            onPress={handleBack}
            className="p-2"
            disabled={isLoading}
          >
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>

          <View className="flex-row items-center space-x-4">
            {!isNewNote && (
              <TouchableOpacity
                onPress={handleDelete}
                className="p-2"
                disabled={isLoading}
              >
                <Icon name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-black rounded-full px-4 py-2"
              disabled={isLoading || (!title.trim() && !content.trim())}
            >
              <Text className="text-white text-sm font-medium">
                {isLoading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View className="px-4 py-4">
            {/* Title Input */}
            <TextInput
              ref={titleRef}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="Note title"
              placeholderTextColor="#9ca3af"
              className="text-2xl font-semibold text-gray-900 mb-4"
              multiline
              editable={!isLoading}
            />

            {/* Content Input */}
            <TextInput
              ref={contentRef}
              value={content}
              onChangeText={handleContentChange}
              placeholder="Start writing..."
              placeholderTextColor="#9ca3af"
              className="text-base text-gray-700 leading-6"
              multiline
              textAlignVertical="top"
              style={{ minHeight: 200 }}
              editable={!isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}