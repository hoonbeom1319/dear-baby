import { ImageResponse } from 'next/og';

export async function GET() {
    return new ImageResponse(
        <div
            style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <span style={{ fontSize: 256, lineHeight: 1 }}>🍼</span>
        </div>,
        { width: 512, height: 512 },
    );
}
