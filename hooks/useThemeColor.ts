/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

// Force light theme colors for chat components to prevent white text on light backgrounds
export function useForcedLightThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const colorFromProps = props.light; // Always use light theme color
  
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors.light[colorName]; // Always use light theme colors
  }
}

// Chat-specific color constants to ensure consistency
export const ChatColors = {
  background: '#f1f5f9',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  bubbleBackground: '#ffffff',
  buttonBackground: '#e2e8f0',
  primaryBackground: '#020617',
  primaryText: '#ffffff',
} as const;
