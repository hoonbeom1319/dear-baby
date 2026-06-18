'use client';

import { Icon } from '@/shared/ui';

import { Sheet } from '@/hbds/overlay/sheet';

import type { EditorGroup } from '../model/use-editor-draft';

type MoveSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    count: number;
    groups: EditorGroup[];
    onPick: (groupId: string) => void;
    onPickNew: () => void;
};

/** 선택한 사진을 어느 장소로 옮길지 고르는 시트. 기존 장소 + "새 장소 만들기". */
export function MoveSheet({ open, onOpenChange, count, groups, onPick, onPickNew }: MoveSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} title={`${count}장을 어디로 옮길까요?`} description="장소를 선택하세요">
            <div className="flex flex-col">
                {groups.map((group) => (
                    <button
                        key={group.id}
                        type="button"
                        onClick={() => onPick(group.id)}
                        className="flex items-center gap-2.5 border-b border-[#F1F5F9] px-3 py-3.5 text-left text-[15px] text-[#334155]"
                    >
                        <Icon name="pin" size={18} className="shrink-0 fill-primary-600 text-white" stroke={1.2} />
                        <span className="truncate">{group.name.trim() || '이름 없는 장소'}</span>
                    </button>
                ))}
                <button type="button" onClick={onPickNew} className="flex items-center gap-2.5 px-3 py-3.5 text-left text-[15px] font-semibold text-primary-600">
                    <Icon name="plus" size={18} stroke={2} />새 장소 만들기
                </button>
            </div>
        </Sheet>
    );
}
