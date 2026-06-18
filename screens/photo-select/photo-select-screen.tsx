'use client';

import { useRef } from 'react';

import { useRouter } from 'next/navigation';

import { useRecordDraft } from '@/features/day-editor';

import { useFileDrop } from '@/shared/hooks';
import { Icon } from '@/shared/ui';

import { usePhotoPicker } from './model/use-photo-picker';
import { EmptyState } from './ui/empty-state';
import { PhotoGrid } from './ui/photo-grid';

/**
 * A-2 사진 선택 — 갤러리에서 하루치 다중 선택(PRD F-1).
 * 고른 File[]을 기록 드래프트에 담고 편집기(A-3)로 넘긴다. 0장이면 F-5 샛길.
 */
export function PhotoSelectScreen() {
    const router = useRouter();
    const setFiles = useRecordDraft((s) => s.setFiles);
    const { photos, selectedCount, addFiles, toggle, selectedFiles } = usePhotoPicker();
    const inputRef = useRef<HTMLInputElement>(null);
    // PC 어포던스 — 탐색기에서 파일을 끌어다 놓아도 추가된다(이미지 파일만 통과).
    const { isOver, dropProps } = useFileDrop(addFiles);

    const openPicker = () => inputRef.current?.click();

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const picked = Array.from(event.target.files ?? []);
        if (picked.length > 0) addFiles(picked);
        event.target.value = ''; // 같은 파일 재선택도 onChange가 다시 뜨게
    };

    const proceed = (files: File[]) => {
        setFiles(files);
        router.push('/editor');
    };

    return (
        <div className="relative flex h-dvh flex-col bg-white" {...dropProps}>
            <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleInput} />

            {/* 드래그 중 오버레이 (PC). 빈 상태·그리드 상태 공통 */}
            {isOver && (
                <div className="pointer-events-none absolute inset-2 z-50 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-600 bg-primary-50/90 text-primary-700">
                    <Icon name="image" size={32} stroke={1.9} />
                    <span className="text-[15px] font-bold">여기에 사진을 놓으세요</span>
                </div>
            )}

            <header className="flex h-[52px] shrink-0 items-center justify-between px-2" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                <button type="button" onClick={() => router.back()} aria-label="뒤로" className="flex h-10 w-10 items-center justify-center rounded-full text-[#334155] hover:bg-neutral-100">
                    <Icon name="back" size={22} />
                </button>
                <span className="text-[16px] font-bold text-[#0F172A]">사진 선택</span>
                <div className="flex h-10 w-10 items-center justify-center">
                    {photos.length > 0 && (
                        <button type="button" onClick={openPicker} className="text-[14px] font-semibold text-primary-700 hover:text-primary-600">
                            추가
                        </button>
                    )}
                </div>
            </header>

            {photos.length === 0 ? (
                <EmptyState onPick={openPicker} onSkip={() => proceed([])} />
            ) : (
                <>
                    <main className="flex-1 overflow-y-auto pb-32">
                        <p className="px-5 py-3 text-[14px] leading-[1.6] text-[#64748B] [word-break:keep-all]">
                            하루치 사진을 골라주세요. 위치·시간 정보로 장소를 자동 정리해드려요.
                        </p>
                        <PhotoGrid photos={photos} onToggle={toggle} />
                    </main>

                    {/* 하단 고정 CTA — 상단 흰 그라데이션 페이드 */}
                    <div
                        className="absolute inset-x-0 bottom-0 px-5 pt-8"
                        style={{
                            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
                            background: 'linear-gradient(to top, #FFFFFF 60%, rgba(255,255,255,0))'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => proceed(selectedCount > 0 ? selectedFiles : [])}
                            className="flex h-[54px] w-full items-center justify-center rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700"
                            style={{ boxShadow: '0 10px 22px -8px oklch(64.6% 0.222 41.116 / 0.5)' }}
                        >
                            {selectedCount > 0 ? `다음 · ${selectedCount}장 선택` : '사진 없이 장소만 추가'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
