import React from 'react';
import { View, Text } from 'react-native';

interface ContextLabelProps {
  context: string;
  isSwitch?: boolean;
}

export function ContextLabel({ context, isSwitch = false }: ContextLabelProps) {
  const getContextAbbreviation = (context: string) => {
    switch (context) {
      case 'Special Educational Needs':
        return 'Special Educational Needs';
      case 'Artificial Intelligence':
      case 'AI':
        return 'Artificial Intelligence';
      case 'Teacher mental health literacy':
        return 'Teacher mental health';
      default:
        return context;
    }
  };

  const abbreviation = getContextAbbreviation(context);
  
  return (
    <View className="flex-row justify-center my-2">
      <View className="bg-slate-200 rounded-full px-3 py-2">
        <Text className="text-sm font-geist text-slate-900">
          {isSwitch 
            ? `Switched to '${abbreviation}' topic context`
            : `You are in the '${abbreviation}' topic context`
          }
        </Text>
      </View>
    </View>
  );
}