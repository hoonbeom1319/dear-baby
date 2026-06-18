import { useCallback, useRef, useState } from 'react';

type FileDropProps = {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
};

/**
 * 컨테이너에 파일 드래그앤드롭을 붙인다(PC 어포던스). 도메인 무관 범용 hook.
 * `accept`(MIME prefix, 기본 'image/')에 맞는 파일만 추려 onFiles로 넘긴다.
 * dragenter/leave는 자식 위를 지날 때마다 중첩 발생 → 깊이 카운터로 isOver 깜빡임을 막는다.
 */
export function useFileDrop(onFiles: (files: File[]) => void, accept = 'image/'): { isOver: boolean; dropProps: FileDropProps } {
    const [isOver, setIsOver] = useState(false);
    const depth = useRef(0);

    const onDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        depth.current += 1;
        setIsOver(true);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault(); // 이게 없으면 브라우저가 drop을 막는다
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        depth.current -= 1;
        if (depth.current <= 0) {
            depth.current = 0;
            setIsOver(false);
        }
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            depth.current = 0;
            setIsOver(false);
            const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith(accept));
            if (files.length > 0) onFiles(files);
        },
        [onFiles, accept]
    );

    return { isOver, dropProps: { onDragEnter, onDragOver, onDragLeave, onDrop } };
}
