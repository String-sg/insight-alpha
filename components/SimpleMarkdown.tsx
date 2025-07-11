import React from 'react';
import { Text, View } from 'react-native';

interface SimpleMarkdownProps {
  children: string;
  className?: string;
}

export function SimpleMarkdown({ children, className = '' }: SimpleMarkdownProps) {
  // Split content by double newlines to get paragraphs
  const paragraphs = children.split('\n\n');
  
  return (
    <View className={className}>
      {paragraphs.map((paragraph, index) => {
        // Check if paragraph contains bullet list with dashes
        if (paragraph.includes('\n-')) {
          const lines = paragraph.split('\n');
          const title = lines[0];
          const bullets = lines.slice(1).filter(line => line.trim().startsWith('-'));
          
          return (
            <View key={index} className={index > 0 ? 'mt-3' : ''}>
              {title && renderLine(title, index + '-title')}
              <View className="mt-1">
                {bullets.map((bullet, bulletIndex) => (
                  <View key={`${index}-bullet-${bulletIndex}`} className="flex-row mt-1">
                    <Text className="text-slate-600 text-base mr-2">•</Text>
                    <Text className="text-slate-600 text-base leading-6 flex-1">
                      {bullet.replace(/^-\s*/, '').trim()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        }
        
        // Regular paragraph
        return (
          <View key={index} className={index > 0 ? 'mt-3' : ''}>
            {renderLine(paragraph, index)}
          </View>
        );
      })}
    </View>
  );
}

function renderLine(text: string, key: string | number) {
  // Handle bold text
  const parts = text.split(/(\*\*.*?\*\*)/);
  
  if (parts.length === 1) {
    // No bold text
    return (
      <Text key={key} className="text-slate-600 text-base leading-6">
        {text}
      </Text>
    );
  }
  
  // Has bold text
  return (
    <Text key={key}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Bold text
          const boldText = part.slice(2, -2);
          return (
            <Text key={index} className="text-slate-900 text-base font-semibold">
              {boldText}
            </Text>
          );
        }
        // Regular text
        return (
          <Text key={index} className="text-slate-600 text-base leading-6">
            {part}
          </Text>
        );
      })}
    </Text>
  );
}