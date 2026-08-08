import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className = '', as: Tag = 'div', ...props }: CardProps) {
  return (
    <Tag
      className={`bg-surface border border-border rounded p-4 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
