import { PodcastSource } from '@/types/podcast';
import * as Clipboard from 'expo-clipboard';
import { BookOpen, Bot, Copy, Share } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Linking, Platform, Text, TouchableOpacity, View } from 'react-native';

interface ShareDropdownProps {
  contentInfo: {
    title: string;
    subtitle?: string;
    description?: string;
    summary?: string;
  } | null;
  script?: string;
  sources?: PodcastSource[];
  onExamineSources?: () => void;
}

export function ShareDropdown({ contentInfo, script, sources, onExamineSources }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const generateSystemPrompt = (includeSources = false, encodeForUrl = true) => {
    if (!contentInfo) return '';
    
    // Combine script and description for full transcript
    const fullTranscript = `${script || ''}\n\n${contentInfo.description || ''}`.trim();
    
    let fullContent = `
<notes>
<critical>
Below are notes from a video course about working with the Claude language model.
Use these notes as a resource to answer the user's question.
Write your answer as a standalone response - do not refer directly to these notes unless specifically requested by the user.
</critical>

${fullTranscript}

${contentInfo.summary ? `**Key Highlights**\n${contentInfo.summary}` : ''}`;

    // Add sources if requested
    if (includeSources && sources && sources.length > 0) {
      fullContent += `\n\n**Further Reading:**\n`;
      sources.forEach((source, index) => {
        fullContent += `${index + 1}. ${source.title} - ${source.author || 'Unknown'} (${source.publishedDate || 'N/A'})\n`;
        fullContent += `   URL: ${source.url}\n`;
      });
    }

    return encodeForUrl ? encodeURIComponent(fullContent) : fullContent;
  };

  const generateCleanContent = (includeSources = false) => {
    if (!contentInfo) return '';
    
    // Combine script and description for full transcript
    const fullTranscript = `${script || ''}\n\n${contentInfo.description || ''}`.trim();
    
    let cleanContent = `**${contentInfo.title}**\n\n${fullTranscript}`;

    if (contentInfo.summary) {
      cleanContent += `\n\n**Key Highlights**\n${contentInfo.summary}`;
    }

    // Add sources if requested
    if (includeSources && sources && sources.length > 0) {
      cleanContent += `\n\n**Further Reading:**\n`;
      sources.forEach((source, index) => {
        cleanContent += `${index + 1}. ${source.title} - ${source.author || 'Unknown'} (${source.publishedDate || 'N/A'})\n`;
        cleanContent += `   URL: ${source.url}\n`;
      });
    }

    return cleanContent;
  };

  const handleOpenInAI = async (platform: 'chatgpt' | 'claude' | 'gemini') => {
    switch (platform) {
      case 'chatgpt':
        if (Platform.OS === 'web') {
          // Glasp-like direct injection approach
          await handleChatGPTInjection('');
        } else {
          // For mobile, fall back to share URL
          const systemPrompt = generateSystemPrompt(false, true); // Encode for URL
          const url = `https://chat.openai.com/share?message=${systemPrompt}`;
          await Linking.openURL(url);
        }
        break;
      case 'claude':
        // Use the remix format with attachment parameter
        const claudePrompt = generateSystemPrompt(false, true); // Encode for URL
        const claudeUrl = `https://claude.ai/remix#q=Explain%20this%20concept%3A&attachment=${claudePrompt}`;
        if (Platform.OS === 'web') {
          window.open(claudeUrl, '_blank');
        } else {
          await Linking.openURL(claudeUrl);
        }
        break;
      case 'gemini':
        const geminiPrompt = generateSystemPrompt(false, true); // Encode for URL
        const geminiUrl = `https://gemini.google.com/app?prompt=${geminiPrompt}`;
        if (Platform.OS === 'web') {
          window.open(geminiUrl, '_blank');
        } else {
          await Linking.openURL(geminiUrl);
        }
        break;
    }
  };

  const handleChatGPTInjection = async (content: string) => {
    try {
      // Get raw content for clipboard (not URL-encoded) - include sources for ChatGPT
      const rawContent = generateSystemPrompt(true, false); // Include sources, don't encode for URL
      try {
        await navigator.clipboard.writeText(rawContent);
      } catch (clipboardError) {
        console.warn('Clipboard access failed:', clipboardError);
      }

      // Open ChatGPT in new tab
      const chatGPTWindow = window.open('https://chat.openai.com', '_blank');
      
      if (!chatGPTWindow) {
        Alert.alert('Error', 'Please allow popups for this site to use the ChatGPT integration.');
        return;
      }

      // Wait for ChatGPT to load
      setTimeout(() => {
        try {
          // Try direct DOM manipulation first
          chatGPTWindow.eval(`
            (function() {
              // Wait for ChatGPT to fully load
              const waitForInput = setInterval(() => {
                const textarea = document.querySelector('textarea[data-id="root"]') || 
                               document.querySelector('textarea[placeholder*="Message"]') ||
                               document.querySelector('textarea[placeholder*="Ask"]') ||
                               document.querySelector('[contenteditable="true"]') ||
                               document.querySelector('div[contenteditable="true"]') ||
                               document.querySelector('[role="textbox"]');
                
                if (textarea) {
                  clearInterval(waitForInput);
                  
                  // Set the content
                  if (textarea.tagName === 'TEXTAREA') {
                    textarea.value = ${JSON.stringify(rawContent)};
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                  } else if (textarea.contentEditable === 'true' || textarea.getAttribute('role') === 'textbox') {
                    textarea.textContent = ${JSON.stringify(rawContent)};
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                  
                  // Find and click the send button
                  setTimeout(() => {
                    const sendButton = document.querySelector('button[data-testid="send-button"]') ||
                                     document.querySelector('button[aria-label*="Send"]') ||
                                     document.querySelector('button[title*="Send"]') ||
                                     document.querySelector('button svg[data-icon="paper-plane"]')?.closest('button') ||
                                     document.querySelector('button[type="submit"]') ||
                                     document.querySelector('button:has(svg)');
                    
                    if (sendButton) {
                      sendButton.click();
                    } else {
                      // If no send button found, try pressing Enter
                      textarea.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                      }));
                    }
                  }, 1000);
                }
              }, 500);
              
              // Timeout after 15 seconds
              setTimeout(() => {
                clearInterval(waitForInput);
              }, 15000);
            })();
          `);
        } catch (error) {
          console.error('ChatGPT injection failed:', error);
          // Show alert with clipboard fallback
          alert('Content copied to clipboard! Please paste it into ChatGPT manually.');
        }
      }, 3000); // Wait 3 seconds for ChatGPT to load

    } catch (error) {
      console.error('Error opening ChatGPT:', error);
      Alert.alert('Error', 'Could not open ChatGPT. Please try again.');
    }
  };



  const handleCopyToClipboard = async () => {
    const content = generateSystemPrompt(true, false); // Include sources, don't encode
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(content);
      } else {
        await Clipboard.setStringAsync(content);
      }
      Alert.alert('Success', 'Content copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Could not copy to clipboard. Please try again.');
    }
  };

  const handleTraditionalShare = async () => {
    try {
      // Generate clean content with sources included (no XML tags)
      const cleanContentWithSources = generateCleanContent(true); // Include sources
      
      const shareData = {
        title: contentInfo?.title || 'Educational Content',
        text: cleanContentWithSources,
        url: window.location.href,
      };
      
      if (Platform.OS === 'web' && navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy clean content with sources to clipboard
        if (Platform.OS === 'web') {
          await navigator.clipboard.writeText(cleanContentWithSources);
        } else {
          await Clipboard.setStringAsync(cleanContentWithSources);
        }
        Alert.alert('Success', 'Content with sources copied to clipboard!');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share content.');
    }
  };

  const shareOptions = [
    {
      id: 'sources',
      title: 'Examine sources',
      subtitle: 'View research references',
      icon: <BookOpen size={16} color="#7C3AED" />,
      action: () => {
        if (onExamineSources) {
          onExamineSources();
        }
      },
    },
    {
      id: 'copy',
      title: 'Copy full content',
      subtitle: 'Copy to clipboard for LLMs',
      icon: <Copy size={16} color="#6B7280" />,
      action: handleCopyToClipboard,
    },
    {
      id: 'chatgpt',
      title: 'Open in ChatGPT',
      subtitle: 'Ask questions about this content',
      icon: <Bot size={16} color="#10A37F" />,
      action: () => handleOpenInAI('chatgpt'),
    },
    {
      id: 'share',
      title: 'Share',
      subtitle: 'Share this content',
      icon: <Share size={16} color="#6B7280" />,
      action: handleTraditionalShare,
    },
  ];

  return (
    <View className="relative">
      {/* Main Button */}
      <View className="bg-white rounded-full px-4 py-2 flex-row items-center shadow-sm">
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center"
        >
          <BookOpen size={16} color="#374151" strokeWidth={2} />
          <Text className="text-gray-700 text-sm font-medium ml-2">Dive deeper</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {isOpen && (
        <View className="absolute bottom-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 min-w-64" style={{ zIndex: 999999, elevation: 999999 }}>
          <View className="p-2">
            {shareOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className={`flex-row items-center p-3 rounded-lg ${
                  index === shareOptions.length - 1 ? '' : 'mb-1'
                } active:bg-gray-50`}
              >
                <View className="mr-3">
                  {option.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">
                    {option.title}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {option.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <TouchableOpacity
          className="absolute inset-0 -top-12 -bottom-12 -left-12 -right-12"
          style={{ zIndex: 999998, elevation: 999998 }}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
}
