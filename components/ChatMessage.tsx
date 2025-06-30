import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Icon } from '@/components/Icon';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { aiUser } from '@/data/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isLastMessage?: boolean;
}

export function ChatMessage({ message, isLastMessage = false }: ChatMessageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  const isAI = message.userId === aiUser.id;
  const isTyping = message.type === 'typing';

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Icon name="Clock" size={12} color="#9CA3AF" />;
      case 'sent':
        return <Icon name="Check" size={12} color="#9CA3AF" />;
      case 'delivered':
        return <Icon name="CheckCheck" size={12} color="#3B82F6" />;
      case 'failed':
        return <Icon name="AlertCircle" size={12} color="#EF4444" />;
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className={`mb-4 ${isLastMessage ? 'mb-6' : ''}`}
    >
      <View className={`flex-row ${isAI ? 'justify-start' : 'justify-end'}`}>
        {/* AI Avatar */}
        {isAI && (
          <View className="mr-3 mt-1">
            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
              <Icon name="Bot" size={16} color="#3B82F6" />
            </View>
          </View>
        )}

        {/* Message Content */}
        <View className={`max-w-[80%] ${isAI ? 'items-start' : 'items-end'}`}>
          {/* Message Bubble */}
          <View
            className={`px-4 py-3 rounded-2xl ${
              isAI
                ? 'bg-slate-100 rounded-bl-md'
                : 'bg-blue-500 rounded-br-md'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            {isTyping ? (
              // Typing indicator
              <View className="flex-row items-center space-x-2">
                <View className="flex-row space-x-1">
                  {[0, 1, 2].map((index) => (
                    <Animated.View
                      key={index}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                      style={{
                        opacity: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }),
                      }}
                    />
                  ))}
                </View>
                <ThemedText className="text-sm text-slate-500 italic">
                  AI is typing...
                </ThemedText>
              </View>
            ) : (
              // Regular message
              <ThemedText
                className={`text-base leading-5 ${
                  isAI ? 'text-slate-900' : 'text-white'
                }`}
              >
                {message.content}
              </ThemedText>
            )}
          </View>

          {/* Message metadata */}
          {!isTyping && (
            <View
              className={`flex-row items-center mt-1 px-1 ${
                isAI ? 'justify-start' : 'justify-end'
              }`}
            >
              <ThemedText className="text-xs text-slate-500 mr-1">
                {formatTime(message.timestamp)}
              </ThemedText>
              
              {/* Status indicator for user messages */}
              {!isAI && (
                <View className="ml-1">
                  {getStatusIcon()}
                </View>
              )}
            </View>
          )}
        </View>

        {/* User Avatar Placeholder */}
        {!isAI && (
          <View className="ml-3 mt-1">
            <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}