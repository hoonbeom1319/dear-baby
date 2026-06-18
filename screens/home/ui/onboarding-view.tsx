'use client';

import { Icon } from '@/shared/ui';

type OnboardingViewProps = {
    onStart: () => void;
};

/**
 * C-1 빈 지도 온보딩 — 핀 0개인 첫 사용자에게 첫 기록을 유도(PRD §6.4).
 * 핵심: "빈약함"이 아니라 "채워가는 여백"으로 보이게 — 점선 미래핀 + 따뜻한 카피(PRD §7).
 * 핀이 없어 실지도를 띄울 이유가 없으므로 배경은 디자인 목업 색의 장식 SVG로 둔다.
 */
export function OnboardingView({ onStart }: OnboardingViewProps) {
    return (
        <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#EAEEF3]">
            <EmptyMapBackdrop />

            {/* 하단 그라데이션 카드 — 지도를 흰색으로 페이드시키며 카피를 얹는다 */}
            <div
                className="relative mt-auto flex flex-col items-start"
                style={{
                    padding: '40px 26px calc(env(safe-area-inset-bottom) + 40px)',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #FFFFFF 26%)'
                }}
            >
                <span className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[18px] border border-primary-100 bg-primary-50 text-primary-600">
                    <Icon name="pin" size={28} stroke={1.9} />
                </span>

                <h1 className="text-[27px] leading-[1.3] font-extrabold tracking-[-0.025em] text-[#0F172A] [word-break:keep-all]">
                    아직 핀이 하나도
                    <br />
                    없는 지도예요
                </h1>

                <p className="mt-3 text-[16px] leading-[1.7] text-[#475569] [word-break:keep-all]">
                    아이와 다녀온 첫 장소를 남겨보세요.
                    <br />이 빈 지도가 우리 가족의 추억으로
                    <br />
                    천천히 채워질 거예요.
                </p>

                <button
                    type="button"
                    onClick={onStart}
                    className="mt-7 flex h-[54px] w-full items-center justify-center rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700"
                    style={{ boxShadow: '0 10px 22px -8px oklch(64.6% 0.222 41.116 / 0.5)' }}
                >
                    첫 기록 남기기
                </button>

                <p className="mt-4 flex w-full items-center justify-center gap-1.5 text-[13px] text-[#94A3B8] [word-break:keep-all]">
                    <Icon name="image" size={15} stroke={1.9} />
                    사진을 고르면 장소가 자동으로 정리돼요
                </p>
            </div>
        </div>
    );
}

/** 디자인 목업 색의 장식용 빈 지도(도로·녹지 + 미래 핀 자리 점선 원). 실데이터 없음. */
function EmptyMapBackdrop() {
    return (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="390" height="560" fill="#EAEEF3" />
            {/* 녹지 */}
            <ellipse cx="250" cy="250" rx="86" ry="62" fill="#DDE9CF" />
            <ellipse cx="70" cy="150" rx="60" ry="44" fill="#DDE9CF" opacity="0.7" />
            {/* 도로 — 외곽(연회색) 위에 안쪽(흰) */}
            <g stroke="#CDD5DF" strokeWidth="14" fill="none" strokeLinecap="round">
                <path d="M-20 120 L420 90" />
                <path d="M-20 320 L420 360" />
                <path d="M120 -20 L150 580" />
                <path d="M300 -20 L270 580" />
            </g>
            <g stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round">
                <path d="M-20 120 L420 90" />
                <path d="M-20 320 L420 360" />
                <path d="M120 -20 L150 580" />
                <path d="M300 -20 L270 580" />
            </g>
            {/* 미래 핀 자리 — 점선 원 5개 */}
            <g fill="none" strokeWidth="2" strokeDasharray="5 5">
                <circle cx="168" cy="190" r="22" stroke="#B6C0CD" />
                <circle cx="262" cy="138" r="18" stroke="#CCD4DE" />
                <circle cx="92" cy="300" r="20" stroke="#C2CAD5" />
                <circle cx="300" cy="278" r="16" stroke="#CCD4DE" />
                <circle cx="210" cy="338" r="19" stroke="#B6C0CD" />
            </g>
        </svg>
    );
}
