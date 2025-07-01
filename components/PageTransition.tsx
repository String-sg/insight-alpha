import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'modal';
  duration?: number;
  delay?: number;
}

export function PageTransition({ 
  children, 
  type = 'fade', 
  duration = 300, 
  delay = 0 
}: PageTransitionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animations = [];

      switch (type) {
        case 'fade':
          animations.push(
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            })
          );
          break;
        
        case 'slide':
          animations.push(
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ])
          );
          break;
        
        case 'scale':
          animations.push(
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
              }),
            ])
          );
          break;
        
        case 'modal':
          animations.push(
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration * 0.8,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
              }),
            ])
          );
          break;
      }

      Animated.parallel(animations).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [type, duration, delay, fadeAnim, slideAnim, scaleAnim]);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'fade':
        return {
          opacity: fadeAnim,
        };
      
      case 'slide':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      
      case 'scale':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      
      case 'modal':
        return {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        };
      
      default:
        return {
          opacity: fadeAnim,
        };
    }
  };

  return (
    <Animated.View style={[{ flex: 1 }, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  delay?: number;
  itemDelay?: number;
}

export function StaggeredList({ children, delay = 0, itemDelay = 50 }: StaggeredListProps) {
  return (
    <>
      {children.map((child, index) => (
        <PageTransition
          key={index}
          type="slide"
          duration={200}
          delay={delay + (index * itemDelay)}
        >
          {child}
        </PageTransition>
      ))}
    </>
  );
}