import { create } from 'zustand';

type FeedbackKind = 'correct' | 'reported';

type PlaceFeedbackStore = {
    feedback: Record<string, FeedbackKind>;
    setFeedback: (placeId: string, kind: FeedbackKind) => void;
    getFeedback: (placeId: string) => FeedbackKind | null;
};

const usePlaceFeedbackStore = create<PlaceFeedbackStore>((set, get) => ({
    feedback: {},
    setFeedback: (placeId, kind) => set((s) => ({ feedback: { ...s.feedback, [placeId]: kind } })),
    getFeedback: (placeId) => get().feedback[placeId] ?? null
}));

export const usePlaceFeedback = (placeId: string) => {
    const kind = usePlaceFeedbackStore((s) => s.getFeedback(placeId));
    const setFeedback = usePlaceFeedbackStore((s) => s.setFeedback);
    return { kind, setFeedback: (k: FeedbackKind) => setFeedback(placeId, k) };
};
