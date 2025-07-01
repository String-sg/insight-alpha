import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';

interface ConfettiPieceProps {
  delay: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ delay, x, y, color, size }) => {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      })
    );
    
    rotation.value = withDelay(
      delay,
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, x]
    );
    
    const translateY = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, y - 20, y]
    );
    
    const scale = interpolate(
      progress.value,
      [0, 0.3, 1],
      [0, 1.2, 0]
    );
    
    const opacity = interpolate(
      progress.value,
      [0, 0.7, 1],
      [1, 1, 0]
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotation.value}deg` },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

interface ConfettiProps {
  isVisible: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const colors = ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];
  
  const confettiPieces = Array.from({ length: 8 }).map((_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    const distance = 40 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 4;
    const delay = Math.random() * 100;

    return (
      <ConfettiPiece
        key={index}
        delay={delay}
        x={x}
        y={y}
        color={color}
        size={size}
      />
    );
  });

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {confettiPieces}
    </View>
  );
};