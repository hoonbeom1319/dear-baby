type NestedPaths<T> = {
    [K in keyof T & string]: T[K] extends object ? `${K}` | `${K}.${NestedPaths<T[K]>}` : `${K}`;
}[keyof T & string];

type NestedValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? NestedValue<T[K], Rest>
        : never
    : P extends keyof T
      ? T[P]
      : never;
