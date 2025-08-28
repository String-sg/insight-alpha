import { PodcastSource } from '@/types/podcast';
import { BookOpen, Building2, ExternalLink, FileText, Globe, Video } from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'intranet':
        return <Building2 size={20} color="#1E40AF" />;
      case 'website':
        return <Globe size={20} color="#059669" />;
      case 'research':
        return <BookOpen size={20} color="#DC2626" />;
      case 'article':
        return <FileText size={20} color="#7C3AED" />;
      case 'study':
        return <BookOpen size={20} color="#EA580C" />;
      case 'video':
        return <Video size={20} color="#BE185D" />;
      default:
        return <FileText size={20} color="#6B7280" />;
    }
  };

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'intranet':
        return 'bg-blue-100 text-blue-700';
      case 'website':
        return 'bg-green-100 text-green-700';
      case 'research':
        return 'bg-red-100 text-red-700';
      case 'article':
        return 'bg-purple-100 text-purple-700';
      case 'study':
        return 'bg-orange-100 text-orange-700';
      case 'video':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
              className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2 mb-2">
                    {getSourceIcon(source.type)}
                    <View className={`px-2 py-1 rounded-full ${getSourceTypeColor(source.type)}`}>
                      <Text className="text-xs font-medium capitalize">{source.type}</Text>
                    </View>
                  </View>
                  
                  <Text className="text-base font-medium text-gray-900 mb-1 leading-5">
                    {source.title}
                  </Text>
                  
                  {source.author && (
                    <Text className="text-sm text-gray-600 mb-1">
                      By {source.author}
                    </Text>
                  )}
                  
                  {source.publishedDate && (
                    <Text className="text-xs text-gray-500">
                      Published {source.publishedDate}
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  className="bg-blue-500 p-2 rounded-full"
                  onPress={() => handleSourcePress(source.url)}
                >
                  <ExternalLink size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}