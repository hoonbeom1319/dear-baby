import type { Metadata } from 'next';

import { AppProvider } from '@/application/providers';

import './globals.css';

export const metadata: Metadata = {
    title: 'Dear Baby',
    description: 'Dear Baby is a platform for parents to share ...'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
                />
            </head>
            <body className="font-sans antialiased">
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
}
