'use client';

import { useState } from 'react';

import { PinPicker } from '@/shared/kakao-map';

import { Sheet } from '@/hbds/overlay/sheet';

type PinEditSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    center: { lat: number; lng: number };
    onSubmit: (lat: number, lng: number) => void;
};

/** 핀 위치 수정 시트 — 지도에서 새 좌표를 찍는다. (Radix Dialog가 닫힐 때 언마운트돼 열 때마다 center로 초기화) */
export function PinEditSheet({ open, onOpenChange, center, onSubmit }: PinEditSheetProps) {
    const [coord, setCoord] = useState(center);

    return (
        <Sheet open={open} onOpenChange={onOpenChange} title="핀 위치 수정" description="지도를 눌러 핀을 옮기세요">
            <div className="relative mb-3 h-[240px] overflow-hidden rounded-xl border border-[#e2e8f0]">
                <PinPicker center={center} onChange={(lat, lng) => setCoord({ lat, lng })} className="h-full w-full" />
                <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-[rgba(15,23,42,0.78)] px-2.5 py-1.5 text-[11px] text-white tabular-nums">
                    {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                </div>
            </div>
            <button
                type="button"
                onClick={() => {
                    onSubmit(coord.lat, coord.lng);
                    onOpenChange(false);
                }}
                className="h-[52px] w-full rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700"
            >
                이 위치로 변경
            </button>
        </Sheet>
    );
}
