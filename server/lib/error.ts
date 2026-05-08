export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        public readonly message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class BadRequestError extends ApiError {
    static readonly status = 400;
    static readonly code = 'BAD_REQUEST';
    static readonly message = 'Bad Request';

    constructor(code: string = BadRequestError.code, message: string = BadRequestError.message) {
        super(BadRequestError.status, code, message);
    }
}

export class UnauthorizedError extends ApiError {
    static readonly status = 401;
    static readonly code = 'UNAUTHORIZED';
    static readonly message = 'Unauthorized';

    constructor(code: string = UnauthorizedError.code, message: string = UnauthorizedError.message) {
        super(UnauthorizedError.status, code, message);
    }
}

export class ForbiddenError extends ApiError {
    static readonly status = 403;
    static readonly code = 'FORBIDDEN';
    static readonly message = 'Forbidden';

    constructor(code: string = ForbiddenError.code, message: string = ForbiddenError.message) {
        super(ForbiddenError.status, code, message);
    }
}

export class NotFoundError extends ApiError {
    static readonly status = 404;
    static readonly code = 'NOT_FOUND';
    static readonly message = 'Not Found';

    constructor(code: string = NotFoundError.code, message: string = NotFoundError.message) {
        super(NotFoundError.status, code, message);
    }
}

export class InternalServerError extends ApiError {
    static readonly status = 500;
    static readonly code = 'INTERNAL_SERVER_ERROR';
    static readonly message = 'Internal Server Error';

    constructor(code: string = InternalServerError.code, message: string = InternalServerError.message) {
        super(InternalServerError.status, code, message);
    }
}
