class FetchError<TData = unknown> extends Error {
    override name = 'FetchError';
    cause?: unknown;

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

export { FetchError };
