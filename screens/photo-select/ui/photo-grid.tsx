'use client';

import { Icon } from '@/shared/ui';

import type { PickedPhoto } from '../model/use-photo-picker';

type PhotoGridProps = {
    photos: PickedPhoto[];
    onToggle: (id: string) => void;
};

/** A-2 3열 사진 그리드. 선택 시 primary 오버레이 + 3px 보더 + 체크 배지(db-pop). */
export function PhotoGrid({ photos, onToggle }: PhotoGridProps) {
    return (
        <div className="grid grid-cols-3 gap-[3px]">
            {photos.map((photo) => (
                <button
                    key={photo.id}
                    type="button"
                    onClick={() => onToggle(photo.id)}
                    aria-pressed={photo.selected}
                    className="relative aspect-square overflow-hidden"
                >
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    {photo.selected && (
                        <>
                            <span className="absolute inset-0 bg-primary-600/[0.22]" />
                            <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_3px_var(--color-primary-600)]" />
                            <span className="db-pop absolute top-1.5 right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary-600 text-white shadow-sm">
                                <Icon name="check" size={14} stroke={2.5} />
                            </span>
                        </>
                    )}
                </button>
            ))}
        </div>
    );
}
