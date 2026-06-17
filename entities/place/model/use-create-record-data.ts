import { useMutation, useQueryClient } from '@tanstack/react-query';

import { placeMutations } from '../factory';

/** 기록 세션 생성 (raw mutation) */
export function useCreateRecordData(userId: string | null) {
    const queryClient = useQueryClient();
    return useMutation(placeMutations.createRecord(userId, queryClient));
}
