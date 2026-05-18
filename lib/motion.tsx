'use client'

import { type ReactNode, useRef } from 'react'

import { motion, useInView } from 'motion/react'

interface AnimateInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  x?: number
  scale?: number
  once?: boolean
  amount?: number
  as?: keyof typeof motion
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 20,
  x = 0,
  scale,
  once = true,
  amount = 0.15,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  const initial: Record<string, number | string> = { opacity: 0 }
  const animate: Record<string, number | string> = { opacity: isInView ? 1 : 0 }

  if (y !== 0) {
    initial.y = y
    animate.y = isInView ? 0 : y
  }
  if (x !== 0) {
    initial.x = x
    animate.x = isInView ? 0 : x
  }
  if (scale !== undefined) {
    initial.scale = scale
    animate.scale = isInView ? 1 : scale
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function useScrollTrigger(options?: { once?: boolean; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: options?.once ?? true, amount: options?.amount ?? 0.15 })
  return { ref, isInView }
}
