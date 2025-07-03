import { useCallback } from 'react';
import { Platform } from 'react-native';

// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export const useGoogleAnalytics = () => {
    const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
        if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.gtag) return;

        window.gtag('event', eventName, parameters);
    }, []);

    const trackPageView = useCallback((path: string, title?: string) => {
        if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.gtag) return;

        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
            page_title: title || document.title,
            page_location: window.location.origin + path,
        });
    }, []);

    const trackAudioPlay = useCallback((audioTitle: string, audioId?: string) => {
        trackEvent('audio_play', {
            audio_title: audioTitle,
            audio_id: audioId,
        });
    }, [trackEvent]);

    const trackQuizStart = useCallback((quizTitle: string, quizId?: string) => {
        trackEvent('quiz_start', {
            quiz_title: quizTitle,
            quiz_id: quizId,
        });
    }, [trackEvent]);

    const trackQuizComplete = useCallback((quizTitle: string, quizId?: string, score?: number) => {
        trackEvent('quiz_complete', {
            quiz_title: quizTitle,
            quiz_id: quizId,
            score: score,
        });
    }, [trackEvent]);

    const trackChatMessage = useCallback((messageType: 'user' | 'ai') => {
        trackEvent('chat_message', {
            message_type: messageType,
        });
    }, [trackEvent]);

    return {
        trackEvent,
        trackPageView,
        trackAudioPlay,
        trackQuizStart,
        trackQuizComplete,
        trackChatMessage,
    };
}; 