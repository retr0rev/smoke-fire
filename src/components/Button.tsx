import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  solid: 'bg-red text-white hover:bg-red/90 active:bg-red/80',
  outline: 'border border-red text-red hover:bg-red/10 active:bg-red/20',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface active:bg-surface-elevated',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm min-w-[36px]',
  md: 'h-12 px-4 text-base min-w-[48px]',
  lg: 'h-14 px-6 text-lg min-w-[48px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'solid', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium tracking-wide transition-colors rounded disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
