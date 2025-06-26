import * as LucideIcons from 'lucide-react-native';
import React from 'react';

// Map old Ionicons names to Lucide icon names
const iconMap: Record<string, keyof typeof LucideIcons> = {
  'close': 'X',
  'share-outline': 'Share2',
  'text': 'FileText',
  'play-skip-back': 'SkipBack',
  'play': 'Play',
  'pause': 'Pause',
  'play-skip-forward': 'SkipForward',
  'thumbs-up-outline': 'ThumbsUp',
  'thumbs-down-outline': 'ThumbsDown',
  'document-text-outline': 'FileText',
  'settings-outline': 'Settings',
  'funnel-outline': 'Filter',
  'refresh': 'RefreshCw',
  'checkmark': 'Check',
  'chevron-back': 'ChevronLeft',
  'add': 'Plus',
  'headset': 'Headphones',
  'bulb': 'Lightbulb',
  'bulb-outline': 'Lightbulb',
  'arrow-back': 'ArrowLeft',
  'ellipsis-horizontal': 'MoreHorizontal',
  'sparkles': 'Sparkles',
  'volume-mute': 'VolumeX',
  'volume-low': 'Volume1',
  'volume-high': 'Volume2',
  'home': 'Home',
  'school': 'GraduationCap',
  'compass': 'Compass',
  'accessibility': 'Accessibility',
  'people': 'Users',
  'musical-note': 'Music',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000000', style }) => {
  // Get the Lucide icon name from the map, or use the name directly if not mapped
  const lucideIconName = iconMap[name] || name;
  
  // Get the icon component from LucideIcons
  const IconComponent = LucideIcons[lucideIconName as keyof typeof LucideIcons] as any;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" (mapped to "${lucideIconName}") not found in Lucide icons`);
    return null;
  }
  
  return <IconComponent size={size} color={color} style={style} strokeWidth={2} />;
}; 