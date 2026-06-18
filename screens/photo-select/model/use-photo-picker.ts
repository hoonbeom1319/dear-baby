import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type PickedPhoto = {
    id: string;
    file: File;
    /** 썸네일용 objectURL — 언마운트 시 revoke */
    url: string;
    selected: boolean;
};

/**
 * OS 파일 피커로 고른 사진들의 선택 상태를 관리한다. (A-2, PRD F-1)
 * 웹은 갤러리를 직접 열람할 수 없어, 고른 사진을 보여주고 토글로 추리는 형태로 적응한다.
 * 고른 직후엔 전부 선택 상태(바로 "다음" 가능), 사용자가 빼고 싶은 것만 끈다.
 */
export function usePhotoPicker() {
    const [photos, setPhotos] = useState<PickedPhoto[]>([]);

    // 언마운트 때 현재 objectURL을 전부 revoke한다. 추가(append)만 하므로 개별 해제 시점은 없고
    // 언마운트가 유일한 정리 지점 — ref로 최신 목록을 들고 있다가 cleanup에서 푼다.
    const photosRef = useRef<PickedPhoto[]>([]);
    useEffect(() => {
        photosRef.current = photos;
    }, [photos]);
    useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

    const addFiles = useCallback((files: File[]) => {
        setPhotos((prev) => {
            const added = files.map((file, i) => ({
                id: `${file.name}-${file.lastModified}-${file.size}-${prev.length + i}`,
                file,
                url: URL.createObjectURL(file),
                selected: true
            }));
            return [...prev, ...added];
        });
    }, []);

    const toggle = useCallback((id: string) => {
        setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
    }, []);

    const selectedFiles = useMemo(() => photos.filter((p) => p.selected).map((p) => p.file), [photos]);

    return { photos, selectedCount: selectedFiles.length, addFiles, toggle, selectedFiles };
}
