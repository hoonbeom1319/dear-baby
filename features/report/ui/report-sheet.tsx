'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib';
import { Button, Icon, Sheet } from '@/shared/ui';

type ReportSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** 객관식 한 줄 제보 생성. 비회원도 가능, 운영자 검토 후 반영. (PRD F-13) */
    onSubmit: (reason: string) => void;
};

const OPTIONS = [
    '기저귀 갈이대가 없어졌어요',
    '수유실이 없어졌어요',
    '아기의자가 없어졌어요',
    '유모차 진입이 어려워요',
    '주차가 어려워요',
    '폐업했어요'
];

export const ReportSheet = ({ open, onOpenChange, onSubmit }: ReportSheetProps) => {
    const [selected, setSelected] = useState<string | null>(null);

    const submit = () => {
        if (!selected) return;
        onSubmit(selected);
        setSelected(null);
    };

    return (
        <Sheet
            open={open}
            onOpenChange={(next) => {
                if (!next) setSelected(null);
                onOpenChange(next);
            }}
            title="무엇이 바뀌었나요?"
            description="비회원도 제보할 수 있어요. 운영자가 확인 후 반영해요.">
            <div className="mb-3 flex flex-col gap-1.5">
                {OPTIONS.map((option) => {
                    const active = selected === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setSelected(option)}
                            className={cn(
                                'flex w-full items-center gap-2.5 rounded-[10px] border p-3 text-left text-sm transition-colors',
                                active
                                    ? 'border-primary-500 bg-primary-50 font-medium text-primary-700'
                                    : 'border-border bg-surface text-neutral-700 hover:bg-neutral-50'
                            )}>
                            <span
                                className={cn(
                                    'inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border',
                                    active ? 'border-primary-600 bg-primary-600 text-white' : 'border-neutral-300 text-transparent'
                                )}>
                                <Icon name="check" size={12} stroke={2.5} />
                            </span>
                            {option}
                        </button>
                    );
                })}
            </div>
            <Button block size="lg" disabled={!selected} onClick={submit}>
                제보 보내기
            </Button>
        </Sheet>
    );
};
