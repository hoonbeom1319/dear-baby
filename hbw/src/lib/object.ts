/**
 * 객체를 재귀적으로 병합
 * @param obj 병합할 대상 객체
 * @param updater 병합할 업데이트 객체
 */
export const recursiveMerge = <T extends object>(obj: T, updater: DeepPartial<T>) => {
    for (const key of Object.keys(updater) as Array<keyof T>) {
        const updateValue = updater[key];
        const originValue = obj[key];

        if (
            typeof updateValue === 'object' &&
            updateValue !== null &&
            !Array.isArray(updateValue) &&
            typeof originValue === 'object' &&
            originValue !== null &&
            !Array.isArray(originValue)
        ) {
            recursiveMerge(originValue, updateValue as DeepPartial<T[keyof T]>);
        } else {
            obj[key] = updateValue as T[keyof T];
        }
    }
    return obj;
};

/**
 * 객체에서 중첩된 속성 값 조회
 * @param obj 대상 객체
 * @param path 점 표기법으로 된 경로 (예: 'user.profile.name')
 * @returns 속성 값
 */
export const getNestedValue = <T extends Record<string, unknown>, P extends NestedPaths<T>>(obj: T, path: P) => {
    return path.split('.').reduce<unknown>((current, key) => {
        if (typeof current === 'object' && current !== null) {
            return (current as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj) as NestedValue<T, P>;
};
