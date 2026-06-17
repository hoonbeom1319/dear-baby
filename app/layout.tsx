import type { Metadata, Viewport } from 'next';
import './globals.css';

import { AppProvider } from '@/application/providers';

import { pretendard } from '@/shared/config/font';

export const metadata: Metadata = {
    title: 'Dear Baby',
    description: '아이와 간 장소를 날짜·사진과 함께 지도에 기록하는 우리 가족의 추억 지도',
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
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
}
