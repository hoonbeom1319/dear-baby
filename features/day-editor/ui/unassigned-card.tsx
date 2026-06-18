'use client';

import { Icon } from '@/shared/ui';

import type { EditorPhoto } from '../model/use-editor-draft';

import { EditorPhotoTile } from './editor-photo-tile';

type UnassignedCardProps = {
    photos: EditorPhoto[];
    selected: Set<string>;
    onTapPhoto: (id: string) => void;
};

/**
 * 미분류 사진 카드 (PRD F-3). 위치 없는 사진을 "예외"가 아니라 메인 흐름의 일부로,
 * warning 색 점선 카드에 동등한 무게로 보여준다.
 */
export function UnassignedCard({ photos, selected, onTapPhoto }: UnassignedCardProps) {
    return (
        <div className="mb-3.5 rounded-2xl border border-dashed border-warning bg-[oklch(98.7%_0.022_95.277)] p-3.5">
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                <Icon name="alert" size={18} className="text-[oklch(55%_0.14_70)]" />
                <span className="text-[14px] font-bold text-[oklch(47%_0.1_67)]">미분류 · {photos.length}장</span>
                <span className="basis-full pl-[26px] text-[12px] text-[oklch(55%_0.12_65)]">위치 정보가 없어요. 사진을 눌러 장소에 넣어주세요</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
                {photos.map((photo) => (
                    <EditorPhotoTile key={photo.id} photo={photo} selected={selected.has(photo.id)} onTap={onTapPhoto} />
                ))}
            </div>
        </div>
    );
}
