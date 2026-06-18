import { create } from 'zustand';

export type MapViewport = { lat: number; lng: number; level: number };

type MapViewportStore = {
    /** 마지막으로 본 지도 중심·줌. 장소 상세를 다녀와도 확대 상태를 잃지 않으려고 세션 동안 보존한다. */
    viewport: MapViewport | null;
    save: (viewport: MapViewport) => void;
};

export const useMapViewport = create<MapViewportStore>((set) => ({
    viewport: null,
    save: (viewport) => set({ viewport })
}));
