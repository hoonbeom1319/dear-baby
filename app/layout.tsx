import type { Metadata, Viewport } from 'next';
import './globals.css';

import { AppProvider, ServerProvider } from '@/application/providers';

import { pretendard } from '@/shared/config/font';

export const metadata: Metadata = {
    title: 'Dear Baby',
    description: '아이와 갈 수 있는 장소 가이드',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Dear Baby'
    },
    formatDetection: { telephone: false }
};

export const viewport: Viewport = {
    themeColor: '#d97706',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" className={pretendard.variable}>
            <head />
            <body>
                <ServerProvider>
                    <AppProvider>{children}</AppProvider>
                </ServerProvider>
            </body>
        </html>
    );
}
