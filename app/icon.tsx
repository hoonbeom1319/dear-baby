import { ImageResponse } from 'next/og';

export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        <div
            style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '22%'
            }}
        >
            <span style={{ fontSize: 96, lineHeight: 1 }}>🍼</span>
        </div>,
        { ...size }
    );
}
