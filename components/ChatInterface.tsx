import { ChatMessage } from '@/components/ChatMessage';
import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { useAudioContext } from '@/contexts/AudioContext';
import { useChatContext } from '@/contexts/ChatContext';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const { currentSession, isTyping, sendMessage } = useChatContext();
  const { currentPodcast } = useAudioContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

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
        <ThemedText lightColor="#475569" darkColor="#475569" className="text-lg font-medium mt-4 text-center">
          No active chat session
        </ThemedText>
        <ThemedText lightColor="#64748b" darkColor="#64748b" className="text-sm mt-2 text-center">
          Start a conversation with the AI assistant
        </ThemedText>
      </View>
    );
  }

  const messages = currentSession.messages || [];

  // Get current topic from podcast if available
  const currentTopic = currentPodcast?.category || 'Special Educational Needs';
  
  // Suggested questions based on topic
  const suggestedQuestions = currentTopic === 'Special Educational Needs' ? [
    "What are three quick strategies for teaching reading to a student with dyslexia in a mainstream classroom?",
    "How can I create a sensory-friendly classroom for students with autism spectrum disorder?",
    "What are effective ways to support students with ADHD in group activities?"
  ] : [
    "How can I use AI to create personalized learning materials?",
    "What are the best practices for using AI in education?",
    "How can AI help with assessment and feedback?"
  ];

  const handleQuestionPress = (question: string) => {
    setInputText(question);
    setShowSuggestions(false);
    sendMessage(question);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
      setShowSuggestions(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-slate-100"
      style={{ backgroundColor: '#f1f5f9' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        <View className="flex-row items-center px-6 pt-4 pb-4">
          <TouchableOpacity
            onPress={onClose}
            className="w-12 h-12 items-center justify-center rounded-full bg-slate-200"
            activeOpacity={0.7}
          >
            <Icon name="chevron-back" size={24} style={{ color: '#020617' }} />
          </TouchableOpacity>
          
          <View className="ml-4">
            <View className="bg-slate-950 px-2.5 py-0.5 rounded-md">
              <Text className="text-white text-xs font-geist-semibold">Ask AI</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {showSuggestions && messages.length === 0 ? (
          <View className="mt-6">
            <Text className="text-xl font-geist-medium mb-4 leading-7 text-black">
              Hi Mr. Tan, here are some of the example questions relevant to {currentTopic} topic.
            </Text>
            
            <View className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleQuestionPress(question)}
                  className={`${index === 2 ? 'bg-slate-200' : 'bg-white'} rounded-3xl p-4`}
                  style={index === 2 ? {} : {}}
                  activeOpacity={0.7}
                >
                  <Text className="text-base font-geist leading-6 text-slate-950">
                    &ldquo;{question}&rdquo;
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
              />
            ))}
            
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
          </View>
        )}
      </ScrollView>

      {/* Floating Input Bar */}
      <View className="absolute bottom-6 left-6 right-6">
        <View 
          className="flex-row items-center rounded-full"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderWidth: 1,
            borderColor: 'rgba(226, 232, 240, 0.8)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 4.4,
            elevation: 5,
          }}
        >
          <TouchableOpacity
            className="w-12 h-12 m-3 items-center justify-center rounded-full bg-slate-200"
            activeOpacity={0.7}
          >
            <Icon name="add" size={24} style={{ color: '#020617' }} />
          </TouchableOpacity>
          
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Ask AI about ${currentTopic === 'Special Educational Needs' ? 'SEN' : currentTopic}`}
            placeholderTextColor="#64748b"
            className="flex-1 text-sm font-geist mr-2"
            className="text-slate-600"
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 m-3 items-center justify-center rounded-full"
            className={inputText.trim() ? 'bg-slate-950' : 'bg-slate-300'}
            activeOpacity={0.7}
          >
            <Icon name="send" size={20} style={{ color: '#FFFFFF' }} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}