export type PlaceId = string;

export type Place = {
    id: PlaceId;
    regionCode: string;
    subRegion: string;
    kind: string;
    name: string;
    shortDescription: string;
    honeyTip?: string | null;
    address?: string | null;
    lat?: number | null;
    lng?: number | null;
    mapLinks?: { kakao?: string; naver?: string; tmap?: string } | null;
    images?: string[] | null;
    createdAt?: string;
    updatedAt?: string;
};

export type PlaceListQuery = {
    regionCode?: string;
    subRegion?: string;
    limit?: number;
    cursor?: string;
};

