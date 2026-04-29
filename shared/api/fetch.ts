import { resolveRequestMethod, resolveRequestUrl, resolveResponse } from './helper';

class FetchError<TData = unknown> extends Error {
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

const FETCH = async <T = unknown>(input: string | URL, init?: RequestInit) => {
    let response: Response;

    const url = resolveRequestUrl(input);
    const method = resolveRequestMethod(init);

    try {
        response = await fetch(input, init);
    } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Fetch failed';
        throw new FetchError({ message, status: 0, statusText: 'FETCH_FAILED', url, method, cause });
    }

    if (!response.ok) {
        const cloned = response.clone();
        const data = await cloned.text();
        const status = response.status;
        const statusText = response.statusText;
        const message = `Request failed with status code ${status}`;

        throw new FetchError({ message, status, statusText, url, method, data, response });
    }

    return resolveResponse<T>(response);
};

export { FETCH };
