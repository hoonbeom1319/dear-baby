import localFont from 'next/font/local';

const pretendard = localFont({
    src: [
        {
            path: '../application/assets/fonts/PretendardVariable.woff2',
            style: 'normal'
        }
    ],
    variable: '--font-pretendard',
    display: 'swap',
    weight: '45 920'
});

export { pretendard };
