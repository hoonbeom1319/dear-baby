'use client';

import type { EditorPhoto } from '../model/use-editor-draft';

type EditorPhotoTileProps = {
    photo: EditorPhoto;
    selected: boolean;
    onTap: (id: string) => void;
};

/** 편집기 4열 그리드의 사진 한 칸. 탭하면 선택 토글(선택 시 primary 보더 + 오버레이). */
export function EditorPhotoTile({ photo, selected, onTap }: EditorPhotoTileProps) {
    return (
        <button
            type="button"
            onClick={() => onTap(photo.id)}
            aria-pressed={selected}
            className="relative aspect-square overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]"
        >
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
            {selected && <span className="absolute inset-0 rounded-lg bg-primary-500/[0.18] shadow-[inset_0_0_0_3px_var(--color-primary-600)]" />}
        </button>
    );
}
