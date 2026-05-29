'use client';

import type { ReactNode } from 'react';

import { Dialog } from 'radix-ui';

import { Icon } from './icon';

type SheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
};

/**
 * 화면 하단에서 올라오는 바텀 시트. (PRD F-12 로그인 / 길찾기 / 제보 공용)
 * Radix Dialog 기반이라 포커스 트랩 · Esc 닫기 · 스크롤 잠금이 보장된다.
 */
export const Sheet = ({ open, onOpenChange, title, description, children }: SheetProps) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[1040] animate-[fade-in_150ms_ease-out] bg-neutral-900/45" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-[1050] mx-auto flex w-full max-w-[480px] animate-[sheet-up_240ms_var(--ease-spring)] flex-col rounded-t-[20px] bg-surface px-[18px] pt-3.5 pb-7 shadow-modal focus:outline-none">
                <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-neutral-300" />
                <div className="mb-3 flex items-center justify-between gap-2">
                    <Dialog.Title className="text-[17px] font-semibold tracking-[-0.015em] text-surface-foreground">{title}</Dialog.Title>
                    <Dialog.Close
                        aria-label="닫기"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-surface-foreground"
                    >
                        <Icon name="close" size={22} />
                    </Dialog.Close>
                </div>
                {description && <Dialog.Description className="-mt-1 mb-4 text-[13px] leading-relaxed text-muted">{description}</Dialog.Description>}
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
