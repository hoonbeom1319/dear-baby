export const resolveRequestUrl = (input: URL | string) => {
    if (input instanceof URL) {
        return input.toString();
    }

    return input;
};

export const resolveRequestMethod = (init?: RequestInit) => {
    return init?.method ?? 'GET';
};

export const resolveResponse = async <T>(response: Response) => {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
};
