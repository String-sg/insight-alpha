import { useEffect } from 'react';
import { Platform } from 'react-native';

// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

// Initialize Google Analytics
const initializeGA = () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Add gtag script if not already present
    if (!window.gtag) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_title: document.title,
            page_location: window.location.href,
        });
    }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.origin + path,
    });
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', eventName, parameters);
};

interface GoogleAnalyticsProps {
    pathname: string;
}

export function GoogleAnalytics({ pathname }: GoogleAnalyticsProps) {
    useEffect(() => {
        initializeGA();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'web') {
            trackPageView(pathname);
        }
    }, [pathname]);

    return null;
} 