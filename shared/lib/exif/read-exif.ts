import exifr from 'exifr';

export type PhotoGps = { lat: number; lng: number };

export type PhotoExif = {
    /** WGS84 좌표 — EXIF에 GPS가 없으면 null (SNS·메신저 경유 사진 등 흔함, PRD F-3) */
    gps: PhotoGps | null;
    /** 촬영 시각 — 없으면 null */
    takenAt: Date | null;
};

// 촬영시각 후보 태그 — 우선순위 순. 원본 촬영시각이 가장 정확하다.
const TIME_TAGS = ['DateTimeOriginal', 'CreateDate', 'DateTimeDigitized'] as const;

/**
 * 브라우저에서 사진 한 장의 GPS·촬영시각만 읽는다. (서버 업로드 전, PRD F-1)
 * EXIF가 없거나 깨진 사진도 흔하므로 실패는 throw 대신 null 필드로 흡수한다.
 */
export async function readExif(file: File): Promise<PhotoExif> {
    const [gps, takenAt] = await Promise.all([readGps(file), readTakenAt(file)]);
    return { gps, takenAt };
}

async function readGps(file: File): Promise<PhotoGps | null> {
    try {
        const g = await exifr.gps(file);
        if (!g || !Number.isFinite(g.latitude) || !Number.isFinite(g.longitude)) return null;
        // (0,0) 널섬 — GPS 미기록을 0으로 채운 흔한 케이스. 위치로 쓰지 않는다.
        if (g.latitude === 0 && g.longitude === 0) return null;
        return { lat: g.latitude, lng: g.longitude };
    } catch {
        return null;
    }
}

async function readTakenAt(file: File): Promise<Date | null> {
    try {
        // 배열을 넘기면 pick(해당 태그만 파싱)으로 동작 — 헤더만 읽어 가볍다.
        const out: Record<string, unknown> | undefined = await exifr.parse(file, [...TIME_TAGS]);
        if (!out) return null;
        for (const tag of TIME_TAGS) {
            const v = out[tag];
            if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
        }
        return null;
    } catch {
        return null;
    }
}
