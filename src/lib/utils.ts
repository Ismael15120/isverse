import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getUserLanguage } from './api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
  return num.toString();
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Formatage de date selon la langue utilisateur
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const lang = getUserLanguage().replace('-', '_'); // fr-FR → fr_FR
  try {
    return new Date(dateString).toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Formatage relatif (ex: "il y a 2 jours")
export function formatRelativeDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const lang = getUserLanguage();
  
  if (diffDays === 0) return lang === 'fr-FR' ? "Aujourd'hui" : 'Today';
  if (diffDays === 1) return lang === 'fr-FR' ? 'Hier' : 'Yesterday';
  if (diffDays < 7) {
    return lang === 'fr-FR' ? `Il y a ${diffDays} jours` : `${diffDays} days ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return lang === 'fr-FR' ? `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateString);
}
