import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export interface PageTransitionConfig {
  duration?: number;
  easing?: (value: number) => number;
  useNativeDriver?: boolean;
}

export function usePageTransition(config: PageTransitionConfig = {}) {
  const {
    duration = 300,
    easing = Easing.out(Easing.quad),
    useNativeDriver = true,
  } = config;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Page enter animation
  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        easing,
        useNativeDriver,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver,
      }),
    ]).start();
  };

  // Page exit animation
  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration * 0.7,
        easing: Easing.in(Easing.quad),
        useNativeDriver,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: duration * 0.7,
        easing: Easing.in(Easing.quad),
        useNativeDriver,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: duration * 0.7,
        easing: Easing.in(Easing.quad),
        useNativeDriver,
      }),
    ]).start(callback);
  };

  // Auto-animate in on mount
  useEffect(() => {
    animateIn();
  }, []);

  // Animated styles
  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      { translateY: slideAnim },
      { scale: scaleAnim },
    ],
  };

  return {
    animatedStyle,
    animateIn,
    animateOut,
    fadeAnim,
    slideAnim,
    scaleAnim,
  };
}

// Staggered animation for lists
export function useStaggeredTransition(itemCount: number, config: PageTransitionConfig = {}) {
  const {
    duration = 200,
    easing = Easing.out(Easing.quad),
    useNativeDriver = true,
  } = config;

  const animations = useRef(
    [...Array(itemCount)].map(() => new Animated.Value(0))
  ).current;

  const animateInStaggered = (delay = 50) => {
    const animationSequence = animations.map((anim: Animated.Value, index: number) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: index * delay,
        easing,
        useNativeDriver,
      })
    );

    Animated.stagger(delay, animationSequence).start();
  };

  useEffect(() => {
    animateInStaggered();
  }, []);

  const getItemStyle = (index: number) => ({
    opacity: animations[index],
    transform: [
      {
        translateY: animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return {
    getItemStyle,
    animateInStaggered,
    animations,
  };
}

// Modal-specific transition
export function useModalTransition(config: PageTransitionConfig = {}) {
  const {
    duration = 350,
    easing = Easing.out(Easing.back(1.1)),
    useNativeDriver = true,
  } = config;

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const showModal = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: duration * 0.8,
        easing: Easing.out(Easing.quad),
        useNativeDriver,
      }),
      Animated.timing(modalAnim, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver,
      }),
    ]).start();
  };

  const hideModal = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: duration * 0.6,
        easing: Easing.in(Easing.quad),
        useNativeDriver,
      }),
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: duration * 0.8,
        easing: Easing.in(Easing.back(1.1)),
        useNativeDriver,
      }),
    ]).start(callback);
  };

  useEffect(() => {
    showModal();
  }, []);

  const backdropStyle = {
    opacity: backdropAnim,
  };

  const modalStyle = {
    opacity: modalAnim,
    transform: [
      {
        scale: modalAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
      {
        translateY: modalAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  return {
    backdropStyle,
    modalStyle,
    showModal,
    hideModal,
    backdropAnim,
    modalAnim,
  };
}