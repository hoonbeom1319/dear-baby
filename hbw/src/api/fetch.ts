import { FetchError } from './error';
import { resolveRequestMethod, resolveRequestUrl, resolveResponse } from './helper';

const FETCH = async <T = unknown>(input: string | URL, init?: RequestInit) => {
    let response: Response;

    const url = resolveRequestUrl(input);
    const method = resolveRequestMethod(init);

    try {
        response = await fetch(input, init);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Fetch failed';
        throw new FetchError({ message, status: 0, statusText: 'FETCH_FAILED', url, method });
    }

    const data = await resolveResponse<T>(response);

    if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;
        const message = `Request failed with status code ${status}`;

        throw new FetchError({ message, status, statusText, url, method, error: data as string });
    }

    return data as T;
};

export { FETCH, FetchError };
