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
    // On web, use a regular div with native browser scrolling
    return (
      <View 
        style={[
          {
            flex: 1,
            overflow: 'auto' as any,
            WebkitOverflowScrolling: 'touch' as any,
            // Enable momentum scrolling on iOS Safari
            scrollBehavior: 'smooth' as any,
          },
          style,
          webStyle,
        ]}
      >
        <View style={contentContainerStyle}>
          {children}
        </View>
      </View>
    );
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