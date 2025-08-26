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
      size: 15 + Math.random() * 25, // Random size between 15-40
    }));

    setStars(initialStars);

    const timeouts: number[] = [];

    // Animate individual star
    const animateStar = (star: AnimatedStar) => {
      // Random delay for each star
      const delay = Math.random() * 3000;
      
      const timeout = setTimeout(() => {
        // Random scale values for shrinking and growing
        const minScale = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
        const maxScale = 0.9 + Math.random() * 0.6; // 0.9 to 1.5 (reduced by 25% from 1.2-2.0)
        
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
      <StatusBar style="dark" />
      
      {/* Animated Stars Background */}
      {stars.map(renderStar)}
      
      {/* Logo and Brand */}
      <View className="items-center mb-16">
        <View className="items-center mb-4">
          {/* Icon SVG Logo */}
          <View className="w-20 h-20 items-center justify-center mb-2">
            <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
              <Path d="M23.9385 24.0635L24.0039 24V38L21.3984 26.6084L10 24L21.3984 21.3916L23.998 10.0254V10L24.001 10.0127L24.0039 10V10.0254L26.6045 21.3926L38.001 24H24.002V23.998L24 23.9971L23.999 24L23.9385 24.0635ZM23.998 23.998V23.9941L23.9385 23.9365L23.998 23.998ZM24.0039 23.9941V23.9971L24.0498 23.9492L24.0039 23.9941Z" fill="#0F172A"/>
              <Path d="M26.6025 26.6074L37.999 24H24L24.0479 24.0508L23.9961 24V38L26.6025 26.6074Z" fill="#0F172A"/>
              <Path d="M24 2C25.1046 2 26 2.89543 26 4C26 5.10457 25.1046 6 24 6C22.8954 6 22 5.10457 22 4C22 2.89543 22.8954 2 24 2Z" fill="#0F172A"/>
              <Path d="M24 42C25.1046 42 26 42.8954 26 44C26 45.1046 25.1046 46 24 46C22.8954 46 22 45.1046 22 44C22 42.8954 22.8954 42 24 42Z" fill="#0F172A"/>
              <Path d="M42 22C43.1046 22 44 22.8954 44 24C44 25.1046 43.1046 26 42 26C40.8954 26 40 25.1046 40 24C40 22.8954 40.8954 22 42 22Z" fill="#0F172A"/>
              <Path d="M2 22C3.10457 22 4 22.8954 4 24C4 25.1046 3.10457 26 2 26C0.895431 26 0 25.1046 0 24C0 22.8954 0.895431 22 2 22Z" fill="#0F172A"/>
              <Path d="M36.1403 36.1421C37.2449 36.1421 38.1403 37.0375 38.1403 38.1421C38.1403 39.2467 37.2449 40.1421 36.1403 40.1421C35.0357 40.1421 34.1403 39.2467 34.1403 38.1421C34.1403 37.0375 35.0357 36.1421 36.1403 36.1421Z" fill="#0F172A"/>
              <Path d="M7.85517 7.85791C8.95974 7.85791 9.85517 8.75334 9.85517 9.85791C9.85517 10.9625 8.95974 11.8579 7.85517 11.8579C6.7506 11.8579 5.85517 10.9625 5.85517 9.85791C5.85517 8.75334 6.7506 7.85791 7.85517 7.85791Z" fill="#0F172A"/>
              <Path d="M7.85547 36.1425C8.96004 36.1425 9.85547 37.0379 9.85547 38.1425C9.85547 39.247 8.96004 40.1425 7.85547 40.1425C6.7509 40.1425 5.85547 39.247 5.85547 38.1425C5.85547 37.0379 6.7509 36.1425 7.85547 36.1425Z" fill="#0F172A"/>
              <Path d="M36.1367 7.8581C37.2413 7.8581 38.1367 8.75353 38.1367 9.8581C38.1367 10.9627 37.2413 11.8581 36.1367 11.8581C35.0321 11.8581 34.1367 10.9627 34.1367 9.8581C34.1367 8.75353 35.0321 7.8581 36.1367 7.8581Z" fill="#0F172A"/>
            </Svg>
          </View>
          <Text style={{ fontFamily: 'GeistMono_600SemiBold' }} className="text-slate-800 text-2xl">Insight</Text>
        </View>
      </View>

      {/* Get Started Text */}
      <View className="items-center mb-16">
        <Text style={{ fontFamily: 'GeistMono_600SemiBold' }} className="text-slate-800 text-3xl">Get started.</Text>
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