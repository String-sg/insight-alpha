import { Icon } from '@/components/Icon';
import { aiUser } from '@/data/chat';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

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
        {/* Message Content */}
        <View className={`max-w-[80%] ${isAI ? 'items-start' : 'items-end'}`}>
          {/* Message Bubble */}
          <View
            className={`px-4 py-3 rounded-2xl bg-white ${
              isAI ? 'rounded-bl-md' : 'rounded-br-md'
            }`}
            style={{
              backgroundColor: ChatColors.bubbleBackground,
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
                        backgroundColor: ChatColors.textMuted,
                        opacity: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }),
                      }}
                    />
                  ))}
                </View>
                <Text className="text-sm italic" style={{ color: ChatColors.textMuted }}>
                  AI is typing...
                </Text>
              </View>
            ) : (
              // Regular message - Force light theme text color
              <Text
                className="text-base leading-5"
                style={{ color: ChatColors.textPrimary }}
              >
                {message.content}
              </Text>
            )}
          </View>

          {/* Message metadata */}
          {!isTyping && (
            <View
              className={`flex-row items-center mt-1 px-1 ${
                isAI ? 'justify-start' : 'justify-end'
              }`}
            >
              <Text className="text-xs mr-1" style={{ color: ChatColors.textMuted }}>
                {formatTime(message.timestamp)}
              </Text>
              
              {/* Status indicator for user messages */}
              {!isAI && (
                <View className="ml-1">
                  {getStatusIcon()}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}