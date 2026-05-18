import Link from 'next/link'

import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  children?: React.ReactNode
  [key: string]: unknown
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  outline: 'border border-white text-white hover:bg-white/10',
  ghost: 'text-text hover:bg-black/5',
}

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-3.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[42px] font-semibold tracking-[-0.02em] transition-all duration-200 cursor-pointer outline-none',
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as Record<string, unknown>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as Record<string, unknown>)}>
      {children}
    </button>
  )
}
