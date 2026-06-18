export type CompressOptions = {
    /** 긴 변 최대 px — 이보다 크면 비율 유지하며 축소한다. */
    maxEdge?: number;
    /** 0~1 인코딩 품질 */
    quality?: number;
    /** 출력 MIME */
    type?: string;
};

const DEFAULTS = { maxEdge: 1600, quality: 0.82, type: 'image/webp' } as const;

/**
 * 브라우저 캔버스로 이미지를 축소·재인코딩한다.
 * 원본이 더 작거나 인코딩이 실패하면 원본 File을 그대로 돌려준다(손해 보지 않게).
 *
 * 주의: 재인코딩은 EXIF를 제거한다. 위치·촬영시각은 분석 단계(build-day-groups)에서
 * 원본 File로부터 미리 읽어 따로 보관하므로 여기서 EXIF가 빠져도 무방하다.
 * 화면 방향(orientation)은 디코드 시 픽셀에 구워 넣어(`imageOrientation: 'from-image'`) 보존한다.
 */
export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
    if (!file.type.startsWith('image/')) return file;

    const { maxEdge, quality, type } = { ...DEFAULTS, ...options };

    let bitmap: ImageBitmap | null = null;
    try {
        bitmap = await loadBitmap(file);
        const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return file;
        ctx.drawImage(bitmap, 0, 0, width, height);

        const blob = await canvasToBlob(canvas, type, quality);
        // 인코딩 실패하거나 오히려 더 커졌으면 원본이 낫다.
        if (!blob || blob.size >= file.size) return file;

        return new File([blob], renameExt(file.name, blob.type), { type: blob.type, lastModified: file.lastModified });
    } catch {
        return file;
    } finally {
        bitmap?.close();
    }
}

/** EXIF 방향을 픽셀에 적용해 디코드. 미지원 브라우저면 옵션 없이 재시도. */
async function loadBitmap(file: File): Promise<ImageBitmap> {
    try {
        return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
        return createImageBitmap(file);
    }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** 출력 MIME에 맞춰 확장자만 교체(jpg→webp 등). 점이 없으면 확장자를 붙인다. */
function renameExt(name: string, mime: string): string {
    const ext = mime.split('/')[1] ?? 'webp';
    const dot = name.lastIndexOf('.');
    return dot > 0 ? `${name.slice(0, dot)}.${ext}` : `${name}.${ext}`;
}
