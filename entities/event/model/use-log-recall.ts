import { useMutation } from '@tanstack/react-query';

import { LogRecallSession } from '../api';

/**
 * 순수 되새김 세션 로깅 mutation.
 * 소비처(지도 위젯)에서 "기록 없이 지도를 열어 둘러본" 조건을 판단해 호출한다.
 */
export function useLogRecall() {
    return useMutation({ mutationFn: LogRecallSession });
}
