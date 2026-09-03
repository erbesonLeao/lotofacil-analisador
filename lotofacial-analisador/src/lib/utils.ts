import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDezenas(dezenas: number[]): string {
  return dezenas.map(d => d.toString().padStart(2, '0')).join(' ');
}

export function parseDezenas(text: string): number[] {
  const matches = text.match(/\d+/g);
  if (!matches) return [];
  return matches.map(Number).filter(n => n >= 1 && n <= 25);
}

export function validateDezenas(dezenas: number[]): boolean {
  if (dezenas.length !== 15) return false;
  const unique = new Set(dezenas);
  if (unique.size !== 15) return false;
  return dezenas.every(d => d >= 1 && d <= 25);
}
