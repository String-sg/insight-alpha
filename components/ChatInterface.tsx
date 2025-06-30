import React, { useRef, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Icon } from '@/components/Icon';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const { currentSession, isTyping } = useChatContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [currentSession?.messages]);

  // Header animation
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  if (!currentSession) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Icon name="MessageCircle" size={48} color="#9CA3AF" />
        <ThemedText className="text-lg font-medium text-slate-600 mt-4 text-center">
          No active chat session
        </ThemedText>
        <ThemedText className="text-sm text-slate-500 mt-2 text-center">
          Start a conversation with the AI assistant
        </ThemedText>
      </View>
    );
  }

  const messages = currentSession.messages || [];

  return (
    <View className="flex-1">
      {/* Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          }],
        }}
      >
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
          <View className="flex-row items-center flex-1">
            {/* AI Avatar */}
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Icon name="Bot" size={20} color="#3B82F6" />
            </View>
            
            <View className="flex-1">
              <ThemedText className="text-lg font-semibold text-slate-900">
                AI Assistant
              </ThemedText>
              <ThemedText className="text-sm text-slate-500">
                {isTyping ? 'Typing...' : 'Online'}
              </ThemedText>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center rounded-full bg-slate-100"
            activeOpacity={0.7}
          >
            <Icon name="X" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
              <Icon name="Sparkles" size={24} color="#3B82F6" />
            </View>
            <ThemedText className="text-lg font-medium text-slate-700 text-center mb-2">
              Start a conversation
            </ThemedText>
            <ThemedText className="text-sm text-slate-500 text-center max-w-xs">
              Ask me anything about podcasts, learning, or how to use this app!
            </ThemedText>
          </View>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLastMessage={index === messages.length - 1}
            />
          ))
        )}

        {/* Typing indicator as a message */}
        {isTyping && (
          <ChatMessage
            message={{
              id: 'typing-indicator',
              content: '',
              userId: 'ai-assistant',
              timestamp: new Date(),
              type: 'typing',
              status: 'delivered',
            }}
          />
        )}
      </ScrollView>

      {/* Input */}
      <ChatInput 
        onSend={() => {
          // Scroll to bottom after sending
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }}
      />
    </View>
  );
}