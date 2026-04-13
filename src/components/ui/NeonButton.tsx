import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

/**
 * NeonButton — renommé en style Apple.
 * 'primary'   → gradient violet riche (action principale)
 * 'secondary' → glass transparent avec bordure (action secondaire)
 * 'accent'    → rouge/rose pour actions destructrices
 */
export function NeonButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
}: NeonButtonProps) {
  const variants = {
    primary: [
      'text-white font-semibold',
      'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6]',
      'border border-[rgba(255,255,255,0.15)]',
      'shadow-[0_4px_20px_rgba(124,58,237,0.40)]',
      'hover:from-[#8b5cf6] hover:to-[#7c3aed] hover:shadow-[0_4px_24px_rgba(124,58,237,0.55)]',
    ].join(' '),

    secondary: [
      'text-white/80 font-medium',
      'bg-white/8 hover:bg-white/12',
      'border border-white/14 hover:border-white/22',
      'backdrop-blur-md',
    ].join(' '),

    accent: [
      'text-white font-semibold',
      'bg-gradient-to-r from-[#be123c] to-[#9f1239]',
      'border border-[rgba(255,255,255,0.12)]',
      'shadow-[0_4px_16px_rgba(244,63,94,0.30)]',
      'hover:from-[#e11d48] hover:to-[#be123c]',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px] rounded-xl',
    md: 'px-5 py-2.5 text-[15px] min-h-[44px] rounded-2xl',
    lg: 'px-6 py-3.5 text-base min-h-[52px] rounded-2xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        'active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
