import { NavigationBar } from '@/components/NavigationBar';
import { WebScrollView } from '@/components/WebScrollView';
import { useAudioContext } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { router, Stack } from 'expo-router';
import { BookOpenCheck, CheckSquare, Lightbulb, LogOut } from 'lucide-react-native';
import { Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { currentPodcast } = useAudioContext();
  const { user, logout } = useAuth();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
        contentContainerStyle={{ paddingTop: 76, paddingBottom: bottomPadding }}
        className="flex-1"
      >
        {/* Profile Card */}
        <View className="mx-6 mb-6 bg-white rounded-3xl">
          <View className="flex-row items-start p-4 gap-6">
            <View className="w-[66px] h-[66px] bg-gray-200 rounded-full overflow-hidden items-center justify-center">
              {user?.name ? (
                <Text className="text-2xl font-semibold text-gray-700">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              ) : (
                <Image 
                  source={require('@/assets/images/cover-album.png')} 
                  style={{ width: 66, height: 66 }}
                  resizeMode="cover"
                />
              )}
            </View>
            
            <View className="flex-1 justify-center gap-2">
              <Text className="text-xl font-medium text-slate-950">
                {user?.name || 'Guest User'}
              </Text>
              <Text className="text-base text-slate-600">
                {user?.email || 'No email available'}
              </Text>
              <Text className="text-sm text-slate-500">
                User ID: {user?.uuid || 'N/A'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="p-2 rounded-full bg-red-50"
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#ef4444" />
            </TouchableOpacity>
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