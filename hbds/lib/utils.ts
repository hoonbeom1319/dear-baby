import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const tw = (strings: TemplateStringsArray, ...values: (string | number)[]): string => twMerge(String.raw({ raw: strings }, ...values));

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
