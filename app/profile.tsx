import { View, Text, TouchableOpacity, Image, Platform, SafeAreaView, StatusBar } from 'react-native';
import { router, Stack } from 'expo-router';
import { CheckSquare, BookOpenCheck, Lightbulb, ChevronRight } from 'lucide-react-native';
import { WebScrollView } from '@/components/WebScrollView';
import { NavigationBar } from '@/components/NavigationBar';
import { useAudioContext } from '@/contexts/AudioContext';

export default function ProfileScreen() {
  const { currentPodcast } = useAudioContext();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  const content = (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Navigation Bar */}
      <NavigationBar 
        onBackPress={() => router.back()}
        showUploadButton={false}
      />

      <WebScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: bottomPadding }}
        className="flex-1"
      >
        {/* Profile Card */}
        <View className="mx-6 mt-6 mb-6 bg-white rounded-3xl">
          <View className="flex-row items-start p-4 gap-6">
            <View className="w-[66px] h-[66px] bg-white rounded-full overflow-hidden">
              <Image 
                source={require('@/assets/images/cover-album.png')} 
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            
            <View className="flex-1 justify-center gap-2">
              <Text className="text-xl font-medium text-slate-950">Alex Tan</Text>
              <Text className="text-base text-slate-600">Balestier Hill Secondary School</Text>
              <Text className="text-base text-slate-600">Economics</Text>
            </View>
          </View>
        </View>

        {/* Learning Insights */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold text-black">Learning insights</Text>
            <TouchableOpacity className="bg-[#4a44591a] px-3 py-1.5 rounded-xl">
              <Text className="text-sm font-medium text-black">Weekly</Text>
            </TouchableOpacity>
          </View>

          {/* Stat Cards */}
          <View className="gap-3">
            {/* Streak Card */}
            <View className="bg-white rounded-3xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 bg-black rounded-full items-center justify-center">
                    <CheckSquare size={16} color="white" />
                  </View>
                  <Text className="text-sm font-medium text-black">Streak</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xl font-semibold text-black">3</Text>
                  <Text className="text-sm font-medium text-slate-500">days</Text>
                </View>
              </View>
            </View>

            {/* MLU Consumed Card */}
            <View className="bg-white rounded-3xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 bg-black rounded-full items-center justify-center">
                    <BookOpenCheck size={16} color="white" />
                  </View>
                  <Text className="text-sm font-medium text-black">No. of MLU consumed</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xl font-semibold text-black">12</Text>
                  <Text className="text-sm font-medium text-slate-500">MLUs</Text>
                </View>
              </View>
            </View>

            {/* Completed MLUs Card */}
            <View className="bg-white rounded-3xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 bg-black rounded-full items-center justify-center">
                    <Lightbulb size={16} color="white" />
                  </View>
                  <Text className="text-sm font-medium text-black">Completed MLUs</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xl font-semibold text-black">4</Text>
                  <Text className="text-sm font-medium text-slate-500">MLUs</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* My Learnings */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-semibold text-black mb-4">My learnings</Text>
          
          <View className="gap-3">
            <TouchableOpacity className="bg-white rounded-3xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-slate-950">Learning goal (EPMS)</Text>
                <ChevronRight size={24} color="#1e293b" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-3xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-slate-950">My Collections</Text>
                <ChevronRight size={24} color="#1e293b" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-3xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-slate-950">Recently played</Text>
                <ChevronRight size={24} color="#1e293b" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </WebScrollView>
    </View>
  );

  if (Platform.OS === 'web') {
    return content;
  }

  return (
    <SafeAreaView className="flex-1">
      {content}
    </SafeAreaView>
  );
}