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
    // On web, use a container div with proper overflow handling
    return (
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          height: '100%',
          ...(style as any)
        }}
      >
        <div 
          style={{
            maxWidth: '48rem', // max-w-3xl
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
            ...(contentContainerStyle as any)
          }}
        >
          {children}
        </div>
      </div>
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