import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
}

export function BottomSheet({ visible, onClose, children, height = 490 }: BottomSheetProps) {
  const animHeight = height || 1000; // Use a large value for full-screen
  const translateY = useRef(new Animated.Value(animHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 12,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: animHeight,
          useNativeDriver: true,
          tension: 50,
          friction: 12,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animHeight, translateY, backdropOpacity]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 12,
        }).start();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            className="absolute inset-0 bg-black"
            style={{
              opacity: backdropOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            }}
          />
        </TouchableWithoutFeedback>
        
        <View className="flex-1 justify-end">
          <Animated.View
            style={{
              height: height || '100%',
              transform: [{ translateY }],
              backgroundColor: '#ffffff',
              borderTopLeftRadius: height ? 20 : 0,
              borderTopRightRadius: height ? 20 : 0,
              borderWidth: height ? 1 : 0,
              borderColor: '#e2e8f0',
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 8,
            }}
            {...panResponder.panHandlers}
          >
            {/* Drag handle - only show if not full screen */}
            {height && (
              <View style={{
                width: 48,
                height: 4,
                backgroundColor: '#e2e8f0',
                borderRadius: 2,
                alignSelf: 'center',
                marginTop: 8,
                marginBottom: 16,
              }} />
            )}
            
            {children}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}