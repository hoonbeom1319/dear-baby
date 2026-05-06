import { FetchError } from './error';
import { resolveRequestMethod, resolveRequestUrl, resolveResponse } from './helper';

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

export { FETCH, FetchError };
