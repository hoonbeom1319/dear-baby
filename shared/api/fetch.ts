export class FetchError<TData = unknown> extends Error {
    override name = 'FetchError';
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    readonly method: string;
    readonly data?: TData;
    readonly response?: Response;

    constructor(args: {
        message: string;
        status: number;
        statusText: string;
        url: string;
        method: string;
        data?: TData;
        response?: Response;
        cause?: unknown;
    }) {
        super(args.message);
        this.cause = args.cause;
        this.status = args.status;
        this.statusText = args.statusText;
        this.url = args.url;
        this.method = args.method;
        this.data = args.data;
        this.response = args.response;
    }
}

export const FETCH = async (input: string | URL | globalThis.Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method ?? 'GET';

    try {
        const response = await fetch(input, init);

        if (!response.ok) {
            const cloned = response.clone();
            const data = await cloned.text();

            const message = `Request failed with status code ${response.status}`;

            throw new FetchError({
                message,
                status: response.status,
                statusText: response.statusText,
                url,
                method,
                data,
                response
            });
        }

        return response;
    } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Fetch failed';

        throw new FetchError({
            message,
            status: 0,
            statusText: 'FETCH_FAILED',
            url,
            method,
            cause
        });
    }
};
