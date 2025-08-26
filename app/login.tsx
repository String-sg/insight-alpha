import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Animated, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AnimatedStar {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  scale: Animated.Value;
  rotation: Animated.Value;
  size: number;
}

export default function LoginScreen() {
  const router = useRouter();
  const [stars, setStars] = useState<AnimatedStar[]>([]);

  const handleLogin = () => {
    // Navigate to the main app
    router.replace('/');
  };

  useEffect(() => {
    // Create initial animated stars
    const initialStars: AnimatedStar[] = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      x: Math.random() * 100, // Percentage of screen width
      y: Math.random() * 100, // Percentage of screen height
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
      size: 15 + Math.random() * 25, // Random size between 15-40
    }));

    setStars(initialStars);

    const timeouts: NodeJS.Timeout[] = [];

    // Animate individual star
    const animateStar = (star: AnimatedStar) => {
      // Random delay for each star
      const delay = Math.random() * 3000;
      
      const timeout = setTimeout(() => {
        // Random scale values for shrinking and growing
        const minScale = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
        const maxScale = 1.2 + Math.random() * 0.8; // 1.2 to 2.0
        
        // Fade in and scale up
        Animated.parallel([
          Animated.timing(star.opacity, {
            toValue: 0.7 + Math.random() * 0.3, // Random opacity between 0.7-1.0
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.scale, {
            toValue: maxScale,
            duration: 1500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.rotation, {
            toValue: 1,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Shrink back down
          Animated.parallel([
            Animated.timing(star.scale, {
              toValue: minScale,
              duration: 1200 + Math.random() * 800,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Grow again
            Animated.timing(star.scale, {
              toValue: maxScale,
              duration: 1000 + Math.random() * 800,
              useNativeDriver: true,
            }).start(() => {
              // Fade out
              Animated.parallel([
                Animated.timing(star.opacity, {
                  toValue: 0,
                  duration: 800 + Math.random() * 600,
                  useNativeDriver: true,
                }),
                Animated.timing(star.scale, {
                  toValue: 0,
                  duration: 800 + Math.random() * 600,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                // Reset and reposition
                star.rotation.setValue(0);
                star.x = Math.random() * 100;
                star.y = Math.random() * 100;
                star.size = 15 + Math.random() * 25; // New random size
                
                // Continue the cycle
                const nextTimeout = setTimeout(() => animateStar(star), Math.random() * 2000);
                timeouts.push(nextTimeout);
              });
            });
          });
        });
      }, delay);
      
      timeouts.push(timeout);
    };

    // Start animation for all stars
    initialStars.forEach(animateStar);

    return () => {
      // Cleanup all timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const renderStar = (star: AnimatedStar) => {
    const spin = star.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        key={star.id}
        style={{
          position: 'absolute',
          left: `${star.x}%`,
          top: `${star.y}%`,
          opacity: star.opacity,
          transform: [
            { scale: star.scale },
            { rotate: spin },
          ],
        }}
      >
        <Svg width={star.size} height={star.size} viewBox="0 0 20 20" fill="none">
          <Path 
            d="M-4.37114e-07 10C-4.37114e-07 10 5.70593 9.9636 7.83476 7.83476C9.9636 5.70593 10 -4.37114e-07 10 -4.37114e-07C10 -4.37114e-07 10.0542 5.6881 12.1831 7.81693C14.3119 9.94576 20 10 20 10C20 10 14.3511 10.0934 12.2222 12.2222C10.0934 14.3511 10 20 10 20C10 20 10.0028 14.2549 7.87395 12.1261C5.74511 9.99722 -4.37114e-07 10 -4.37114e-07 10Z" 
            fill="#0F172A"
          />
        </Svg>
      </Animated.View>
    );
  };

  const content = (
    <View className="flex-1 bg-slate-50 justify-center items-center px-6 relative">
      <StatusBar barStyle="dark-content" />
      
      {/* Animated Stars Background */}
      {stars.map(renderStar)}
      
      {/* Logo and Brand */}
      <View className="items-center mb-16">
        <View className="items-center mb-4">
          {/* Pixelated Star Logo */}
          <View className="w-20 h-20 items-center justify-center mb-2 relative">
            {/* Central four-pointed star */}
            <View className="w-12 h-12 relative">
              {/* Top point */}
              <View className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-slate-800" />
              {/* Bottom point */}
              <View className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-slate-800" />
              {/* Left point */}
              <View className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-2 bg-slate-800" />
              {/* Right point */}
              <View className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-2 bg-slate-800" />
              {/* Center square */}
              <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800" />
            </View>
            
            {/* Surrounding pixelated shapes (top, bottom, left, right) */}
            {/* Top shape */}
            <View className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <View className="w-3 h-3 bg-slate-800" />
              <View className="w-1 h-1 bg-slate-800 absolute top-0 left-1/2 transform -translate-x-1/2" />
            </View>
            
            {/* Bottom shape */}
            <View className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <View className="w-3 h-3 bg-slate-800" />
              <View className="w-1 h-1 bg-slate-800 absolute bottom-0 left-1/2 transform -translate-x-1/2" />
            </View>
            
            {/* Left shape */}
            <View className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <View className="w-3 h-3 bg-slate-800" />
              <View className="w-1 h-1 bg-slate-800 absolute left-0 top-1/2 transform -translate-y-1/2" />
            </View>
            
            {/* Right shape */}
            <View className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <View className="w-3 h-3 bg-slate-800" />
              <View className="w-1 h-1 bg-slate-800 absolute right-0 top-1/2 transform -translate-y-1/2" />
            </View>
          </View>
          <Text className="text-slate-800 text-2xl font-semibold">Insight</Text>
        </View>
      </View>

      {/* Get Started Text */}
      <View className="items-center mb-16">
        <Text className="text-slate-800 text-3xl font-bold">Get started.</Text>
      </View>

      {/* OAuth Button */}
      <View className="w-full max-w-sm">
        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-slate-800 rounded-xl py-4 px-6 flex-row items-center justify-center mb-4"
          activeOpacity={0.8}
        >
          {/* Google Logo */}
          <View className="w-6 h-6 mr-3">
            <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
              <Text className="text-lg font-bold" style={{ color: '#4285F4' }}>G</Text>
            </View>
          </View>
          <Text className="text-white text-lg font-medium">Continue with Google</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text className="text-slate-500 text-center text-sm">
          By tapping Continue, you agree to our{'\n'}
          <Text className="underline">Terms and Privacy Policy</Text>
        </Text>
      </View>
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