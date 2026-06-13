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
  primary: 'text-gray-900 bg-white hover:bg-gray-100 border border-white/20',
  outline: 'text-white bg-white/5 hover:bg-white/10 border border-white/10',
  ghost: 'text-white/80 hover:text-white hover:bg-white/10',
}

const sizes = {
  sm: 'h-9 px-4 has-[>svg]:px-3 py-2 text-sm',
  md: 'h-11 px-5 py-3 text-base',
  lg: 'h-12 px-6 py-3.5 text-lg',
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
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all outline-none cursor-pointer',
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
