import { PodcastSource } from '@/types/podcast';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Icon } from './Icon';

interface SourceSheetProps {
  sources: PodcastSource[];
  onClose: () => void;
}

export function SourceSheet({ sources, onClose }: SourceSheetProps) {
  const handleSourcePress = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Silently fail if URL cannot be opened
    });
  };

  return (
    <View className="flex-1 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-black text-xl font-geist-medium">
          Sources
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
        >
          <Icon name="close" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {sources.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-slate-500 text-center">No references available for this podcast</Text>
          </View>
        ) : (
          sources.map((source, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSourcePress(source.url)}
              className="flex-row mb-6"
              activeOpacity={0.7}
            >
              <Text className="text-base font-medium text-slate-900 mr-3 mt-1">
                {index + 1}.
              </Text>
              <View className="flex-1">
                <Text className="text-base text-slate-900 leading-6">
                  {source.author && `${source.author} `}
                  {source.publishedDate && `(${source.publishedDate}). `}
                  {source.title}
                  <Text className="text-blue-600 underline font-medium"> link</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}