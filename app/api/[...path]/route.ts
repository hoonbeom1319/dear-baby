import { NotFoundError } from '@/server/lib/error';
import { toResponseError } from '@/server/lib/response';

const notFound = () => toResponseError(new NotFoundError());

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
export const OPTIONS = notFound;
export const HEAD = notFound;
