import React from 'react';
import { Platform, ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native';

interface WebScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  webStyle?: ViewStyle;
}

/**
 * A cross-platform ScrollView component that uses native browser scrolling on web
 * for better mobile browser compatibility (like Safari's minimizing bottom bar)
 */
export function WebScrollView({ 
  children, 
  style, 
  contentContainerStyle,
  webStyle,
  showsVerticalScrollIndicator = false,
  ...props 
}: WebScrollViewProps) {
  if (Platform.OS === 'web') {
    // On web, return children directly without any wrapper
    // The body will handle the scrolling naturally
    return <>{children}</>;
  }

  // On native platforms, use React Native's ScrollView
  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    >
      {children}
    </ScrollView>
  );
}