import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { Icon } from '@/components/Icon';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatInputProps {
  placeholder?: string;
  maxLength?: number;
  onSend?: (message: string) => void;
}

export function ChatInput({ 
  placeholder = "Type a message...", 
  maxLength = 1000,
  onSend,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { sendMessage, isTyping } = useChatContext();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(colorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSendPress = async () => {
    if (message.trim() && !isTyping) {
      const messageToSend = message.trim();
      setMessage('');
      
      // Button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Send message
      try {
        await sendMessage(messageToSend);
        onSend?.(messageToSend);
      } catch (error) {
        console.error('Failed to send message:', error);
        // Optionally restore message on error
        setMessage(messageToSend);
      }
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      handleSendPress();
    }
  };

  const canSend = message.trim().length > 0 && !isTyping;

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(229, 231, 235)', 'rgb(59, 130, 246)'], // gray-300 to blue-500
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="border-t border-slate-200"
    >
      <View className="flex-row items-end px-4 py-3 space-x-3">
        {/* Text Input Container */}
        <Animated.View 
          className="flex-1 min-h-[44px] max-h-[120px]"
          style={{
            borderWidth: 1.5,
            borderColor: borderColor,
            borderRadius: 22,
            backgroundColor: 'rgb(249, 250, 251)', // gray-50
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="placeholder:text-gray-400"
            multiline
            maxLength={maxLength}
            className="px-4 py-3 text-base text-slate-900 leading-5"
            style={{
              fontFamily: 'Geist_400Regular',
              minHeight: 44,
              maxHeight: 120,
              textAlignVertical: 'center',
            }}
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={handleSendPress}
          />
          
          {/* Character count indicator */}
          {message.length > maxLength * 0.8 && (
            <View className="absolute bottom-1 right-2">
              <View 
                className={`px-2 py-1 rounded-full ${
                  message.length >= maxLength ? 'bg-red-100' : 'bg-slate-100'
                }`}
              >
                <Text 
                  className={`text-xs ${
                    message.length >= maxLength ? 'text-red-600' : 'text-slate-500'
                  }`}
                >
                  {message.length}/{maxLength}
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Send Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleSendPress}
            disabled={!canSend}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              canSend 
                ? 'bg-blue-500 shadow-lg' 
                : 'bg-slate-300'
            }`}
            style={{
              shadowColor: canSend ? 'rgb(59, 130, 246)' : 'transparent', // blue-500
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: canSend ? 4 : 0,
            }}
            activeOpacity={0.8}
          >
            {isTyping ? (
              <Icon name="Clock" size={20} style={{ color: 'white' }} />
            ) : (
              <Icon 
                name="Send" 
                size={18} 
                style={{ color: canSend ? 'white' : '#9CA3AF' }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Input hints */}
      {isFocused && message.length === 0 && (
        <View className="px-4 pb-2">
          <View className="flex-row flex-wrap">
            {['How can I improve my learning?', 'Tell me about podcasts', 'What quizzes are available?'].map((hint, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setMessage(hint)}
                className="bg-slate-100 px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="text-sm text-slate-600">{hint}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}