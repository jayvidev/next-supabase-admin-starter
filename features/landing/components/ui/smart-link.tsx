import Link from 'next/link'

interface SmartLinkProps {
  href: string
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

export function SmartLink({ href, className, onClick, children }: SmartLinkProps) {
  const isExternal = href.startsWith('http')
  const isAnchor = href.startsWith('#')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  if (isAnchor) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
