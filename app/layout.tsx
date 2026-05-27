import type { Metadata, Viewport } from 'next';
import './globals.css';

import { AppProvider } from '@/application/providers';
import { InstallBanner } from '@/features/install-prompt';
import { ServiceWorkerRegistrar } from '@/features/install-prompt/ui/sw-registrar';

import { fetchAllPlaces } from '@/server/actions/places';

export const metadata: Metadata = {
    title: 'Dear Baby',
    description: '아이와 갈 수 있는 장소 가이드',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Dear Baby',
    },
    formatDetection: { telephone: false },
};

export const viewport: Viewport = {
    themeColor: '#d97706',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const initialPlaces = await fetchAllPlaces();

    return (
        <html lang="ko">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
                />
            </head>
            <body>
                <AppProvider initialPlaces={initialPlaces}>{children}</AppProvider>
                <ServiceWorkerRegistrar />
                <InstallBanner />
            </body>
        </html>
    );
}
