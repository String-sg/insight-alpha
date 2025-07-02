import { ChatMessage } from '@/components/ChatMessage';
import { useAudioContext } from '@/contexts/AudioContext';
import { useChatContext } from '@/contexts/ChatContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Plus, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ChatScreen() {
  const router = useRouter();
  const { currentSession, isTyping, sendMessage } = useChatContext();
  const { currentPodcast } = useAudioContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<TextInput>(null);

  const messages = currentSession?.messages || [];

  // Get current topic from podcast if available
  const currentTopic = currentPodcast?.category || 'Special Educational Needs';
  
  // Suggested questions based on topic
  const suggestedQuestions = currentTopic === 'Special Educational Needs' ? [
    "What are three quick strategies for teaching reading to a student with dyslexia in a mainstream classroom?",
    "How can I create a sensory-friendly classroom for students with autism spectrum disorder?",
    "What are effective ways to support students with ADHD in group activities?"
  ] : currentTopic === 'Artificial Intelligence' ? [
    "How can I use AI to create personalized learning materials?",
    "What are the best practices for using AI in education?",
    "How can AI help with assessment and feedback?"
  ] : [
    "What are effective strategies for teacher self-care?",
    "How can I recognize signs of burnout in myself or colleagues?",
    "What resources are available for teacher mental health support?"
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Header animation
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 bg-slate-100" style={{ backgroundColor: '#f1f5f9' }}>
      <StatusBar style="dark" />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Content wrapper with max width */}
          <View className="flex-1 mx-auto w-full" style={{ maxWidth: 768 }}>
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
                onPress={handleBack}
                className="w-12 h-12 items-center justify-center rounded-full bg-slate-200"
                style={{ backgroundColor: '#e2e8f0' }}
                activeOpacity={0.7}
              >
                <ChevronLeft size={24} color="#020617" />
              </TouchableOpacity>
              
              <View className="ml-4">
                <View className="bg-slate-950 px-2.5 py-0.5 rounded-md" style={{ backgroundColor: '#020617' }}>
                  <Text className="text-white text-xs font-geist-semibold" style={{ color: '#ffffff' }}>Ask AI</Text>
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
                <Text className="text-xl font-geist-medium mb-4 leading-7" style={{ color: '#000000' }}>
                  Hi Mr. Tan, here are some of the example questions relevant to {currentTopic} topic.
                </Text>
                
                <View className="space-y-3">
                  {suggestedQuestions.map((question, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleQuestionPress(question)}
                      className={`${index === 2 ? 'bg-slate-200' : 'bg-white'} rounded-3xl p-4 mb-3`}
                      style={{ backgroundColor: index === 2 ? '#e2e8f0' : '#ffffff' }}
                      activeOpacity={0.7}
                    >
                      <Text className="text-base font-geist leading-6" style={{ color: '#020617' }}>
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
                style={{ backgroundColor: '#e2e8f0' }}
                activeOpacity={0.7}
              >
                <Plus size={24} color="#020617" />
              </TouchableOpacity>
              
              <TextInput
                ref={inputRef}
                value={inputText}
                onChangeText={setInputText}
                placeholder={`Ask AI about ${currentTopic === 'Special Educational Needs' ? 'SEN' : currentTopic}`}
                placeholderTextColor="#64748b"
                className="flex-1 text-sm font-geist mr-2"
                style={{ color: '#475569', outline: 'none' } as any}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
              
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim()}
                className={`w-12 h-12 m-3 items-center justify-center rounded-full`}
                style={{ backgroundColor: inputText.trim() ? '#020617' : '#cbd5e1' }}
                activeOpacity={0.7}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}