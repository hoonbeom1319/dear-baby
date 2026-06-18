'use client';

import { formatVisitDateShort } from '@/shared/lib';

import { Sheet } from '@/hbds/overlay/sheet';

import { Icon } from './icon';

type DateSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** 후보 날짜들 (YYYY-MM-DD, 중복 없음). 편집기는 EXIF 후보를, 장소 상세는 비워 둘 수 있다. */
    options: string[];
    value: string | null;
    onPick: (date: string) => void;
};

/**
 * 방문 날짜 시트. 후보 날짜를 고르거나, 직접 날짜를 선택한다.
 * 기록 편집기(EXIF 후보)·장소 상세(방문 날짜 수정) 공용.
 */
export function DateSheet({ open, onOpenChange, options, value, onPick }: DateSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} title="방문 날짜">
            <div className="flex flex-col">
                {options.map((date) => (
                    <button
                        key={date}
                        type="button"
                        onClick={() => onPick(date)}
                        className="flex items-center justify-between border-b border-[#F1F5F9] px-3 py-3.5 text-left text-[15px] text-[#334155] tabular-nums"
                    >
                        {formatVisitDateShort(date)}
                        {date === value && <Icon name="check" size={18} className="text-primary-600" stroke={2.5} />}
                    </button>
                ))}

                <label className="mt-2 flex items-center justify-between gap-3 px-3 py-3 text-[15px] text-[#334155]">
                    <span>직접 선택</span>
                    <input
                        type="date"
                        value={value ?? ''}
                        onChange={(e) => e.target.value && onPick(e.target.value)}
                        className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[14px] text-[#0F172A] outline-none tabular-nums"
                    />
                </label>
            </div>
        </Sheet>
    );
}
