import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Dear Baby',
        short_name: 'Dear Baby',
        description: '아이와 갈 수 있는 장소 가이드',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#d97706',
        icons: [
            { src: '/icon.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
    };
}
