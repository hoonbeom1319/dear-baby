import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Dear Baby',
    description: 'Dear Baby is a platform for parents to share ...'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
