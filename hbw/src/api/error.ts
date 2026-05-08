class FetchError<TError = unknown> extends Error {
    override name = 'FetchError';

    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    readonly method: string;
    readonly error?: TError;
    readonly response?: Response;

    constructor(args: {
        message: string;
        status: number;
        statusText: string;
        url: string;
        method: string;
        error?: TError;
        response?: Response;
        cause?: unknown;
    }) {
        super(args.message);
        this.status = args.status;
        this.statusText = args.statusText;
        this.url = args.url;
        this.method = args.method;
        this.error = args.error;
        this.response = args.response;
    }
}

export { FetchError };
