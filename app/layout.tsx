import type { Metadata } from 'next';
import './globals.css';

import { pretendard } from '@/application/font';
import AppProvider from '@/application/providers/app-provider';

export const metadata: Metadata = {
    title: 'Dear Baby',
    description: 'Dear Baby is a platform for parents to share ...'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" className={pretendard.variable}>
            <body>
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
}
