import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * The single styling primitive every hb-kit component is built on.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
