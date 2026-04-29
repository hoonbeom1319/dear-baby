'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { REGIONS, type RegionCode } from '@/entities/geolocation/lib/resion';

export default function Home() {
    const [regionCode, setRegionCode] = useState<RegionCode>('SEOUL');
    const [subRegionName, setSubRegionName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draftRegionCode, setDraftRegionCode] = useState<RegionCode>('SEOUL');
    const [draftSubRegionName, setDraftSubRegionName] = useState<string>('');
    const [isStep1Dragging, setIsStep1Dragging] = useState(false);

    const selectedRegion = REGIONS[regionCode];
    const selectedLabel = subRegionName ? `${selectedRegion.displayName} ${subRegionName}` : selectedRegion.displayName;
    const regionEntries = useMemo(() => Object.entries(REGIONS) as [RegionCode, (typeof REGIONS)[RegionCode]][], []);
    const draftRegion = REGIONS[draftRegionCode];
    const step1ScrollRef = useRef<HTMLDivElement>(null);
    const dragStartXRef = useRef(0);
    const dragStartScrollLeftRef = useRef(0);

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    const openModal = () => {
        setDraftRegionCode(regionCode);
        setDraftSubRegionName(subRegionName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const completeSelection = () => {
        setRegionCode(draftRegionCode);
        setSubRegionName(draftSubRegionName);
        setIsModalOpen(false);
    };

    const resetDraftSelection = () => {
        setDraftRegionCode('SEOUL');
        setDraftSubRegionName('');
    };

    const handleStep1Wheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
        const container = step1ScrollRef.current;
        if (!container) {
            return;
        }

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            container.scrollLeft += event.deltaY;
        }
    };

    const handleStep1MouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        const container = step1ScrollRef.current;
        if (!container) {
            return;
        }

        setIsStep1Dragging(true);
        dragStartXRef.current = event.clientX;
        dragStartScrollLeftRef.current = container.scrollLeft;
    };

    const handleStep1MouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
        if (!isStep1Dragging) {
            return;
        }

        const container = step1ScrollRef.current;
        if (!container) {
            return;
        }

        event.preventDefault();
        const deltaX = event.clientX - dragStartXRef.current;
        container.scrollLeft = dragStartScrollLeftRef.current - deltaX;
    };

    const stopStep1Dragging = () => {
        setIsStep1Dragging(false);
    };

    return (
        <main className="min-h-screen bg-[#fff8f5] p-4">
            <header className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <div className="flex min-w-0 items-center gap-2">
                    <span aria-hidden className="text-orange-500">
                        <svg viewBox="0 0 24 24" className="size-5 fill-current">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 4.94 6.17 12.26 6.43 12.56a.75.75 0 0 0 1.14 0C12.83 21.26 19 13.94 19 9c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                        </svg>
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-zinc-800">{selectedLabel}</p>
                        <p className="truncate text-xs text-zinc-500">resion: {regionCode}</p>
                    </div>
                </div>

                <button type="button" aria-label="지역 검색" onClick={openModal} className="text-zinc-500">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                        <path d="M10 2a8 8 0 1 0 4.9 14.32l5.39 5.39a1 1 0 0 0 1.42-1.42l-5.39-5.39A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
                    </svg>
                </button>
            </header>

            {isModalOpen ? (
                <div className="fixed inset-0 z-50">
                    <button type="button" aria-label="모달 닫기" className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[2px]" onClick={closeModal} />

                    <section className="absolute right-0 bottom-0 left-0 mx-auto flex max-h-[85vh] w-full max-w-5xl animate-[slide-up_0.35s_cubic-bezier(0.16,1,0.3,1)] flex-col rounded-t-[36px] bg-white shadow-2xl">
                        <div className="flex justify-center py-3">
                            <div className="h-1.5 w-12 rounded-full bg-zinc-200" />
                        </div>

                        <header className="px-6 pb-4 text-center">
                            <h2 className="text-2xl font-extrabold text-zinc-900">지역 선택</h2>
                            <p className="mt-1 text-sm text-zinc-500">시/도와 시/군/구를 선택해 주세요</p>
                        </header>

                        <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setDraftRegionCode('SEOUL');
                                    setDraftSubRegionName('');
                                }}
                                className="mt-1 mb-6 flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4 text-left transition hover:bg-zinc-100"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                                        <svg viewBox="0 0 24 24" className="size-5 fill-current">
                                            <path d="M12 4a8 8 0 1 0 8 8 1 1 0 1 1 2 0 10 10 0 1 1-10-10 1 1 0 1 1 0 2Zm7.78-2.62a1 1 0 0 1 .84 1.13l-.57 4a1 1 0 0 1-1.98-.28l.16-1.16a7.01 7.01 0 1 0 2.28 5.16 1 1 0 1 1 2 0 9 9 0 1 1-2.94-6.65l.08-.56a1 1 0 0 1 1.13-.84Z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">기본 지역으로 설정</p>
                                        <p className="text-xs text-zinc-500">서울시 기준으로 시작</p>
                                    </div>
                                </div>
                                <svg viewBox="0 0 24 24" className="size-5 fill-current text-zinc-300">
                                    <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.58-4.58a1 1 0 0 0 0-1.41l-4.58-4.58a1 1 0 0 0-1.42 0Z" />
                                </svg>
                            </button>

                            <div className="mb-7 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[10px] font-bold tracking-[0.16em] text-zinc-400 uppercase">Step 1: 시/도</span>
                                    <span className="text-[10px] font-bold tracking-[0.16em] text-amber-600 uppercase">선택</span>
                                </div>

                                <div
                                    ref={step1ScrollRef}
                                    onMouseDown={handleStep1MouseDown}
                                    onMouseMove={handleStep1MouseMove}
                                    onMouseUp={stopStep1Dragging}
                                    onMouseLeave={stopStep1Dragging}
                                    className={`no-scrollbar -mx-1 [touch-action:pan-x] overflow-x-auto px-1 ${isStep1Dragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                                >
                                    <div className="flex w-max gap-2.5 pb-1">
                                        {regionEntries.map(([code, region]) => {
                                            const isSelected = draftRegionCode === code;
                                            return (
                                                <button
                                                    type="button"
                                                    key={code}
                                                    onClick={() => {
                                                        setDraftRegionCode(code);
                                                        setDraftSubRegionName('');
                                                    }}
                                                    className={`shrink-0 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition ${isSelected ? 'bg-amber-500 text-white shadow-lg shadow-amber-600/20' : 'border border-zinc-100 bg-white text-zinc-600 hover:bg-zinc-50'}`}
                                                >
                                                    {region.displayName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-[10px] font-bold tracking-[0.16em] text-zinc-400 uppercase">Step 2: {draftRegion.displayName}</span>
                                    <div className="h-px flex-1 bg-zinc-100" />
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                    {draftRegion.sub.map((sub) => {
                                        const isSelected = draftSubRegionName === sub.displayName;
                                        return (
                                            <button
                                                type="button"
                                                key={sub.displayName}
                                                onClick={() => {
                                                    setDraftSubRegionName(sub.displayName);
                                                }}
                                                className={`rounded-2xl border px-3 py-5 text-center text-sm font-medium transition ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100' : 'border-zinc-100 bg-white text-zinc-700 hover:border-amber-200 hover:bg-amber-50/40'}`}
                                            >
                                                {sub.displayName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <footer className="flex gap-3 border-t border-zinc-100 bg-white px-4 pt-4 pb-6 sm:px-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setDraftRegionCode(regionCode);
                                    setDraftSubRegionName(subRegionName);
                                    closeModal();
                                }}
                                className="flex-1 rounded-2xl bg-zinc-100 py-3.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-200"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={completeSelection}
                                className="flex-[1.4] rounded-2xl bg-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-700/20 transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
                            >
                                선택 완료
                            </button>
                        </footer>
                    </section>

                    <style jsx global>{`
                        @keyframes slide-up {
                            from {
                                transform: translateY(100%);
                            }
                            to {
                                transform: translateY(0);
                            }
                        }

                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }

                        .no-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                </div>
            ) : null}
        </main>
    );
}
