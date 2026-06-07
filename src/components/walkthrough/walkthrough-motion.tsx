"use client"

import type { ComponentProps } from "react"
import { motion, type Variants } from "motion/react"

/* Viewport-gated reveal pair for the walkthrough. Mirrors the spring values of
 * feature-tabs/shared.tsx's Reveal (bounce 0.1, 0.45s, y:12) but adds a blur
 * "materialize" and drives via whileInView (once) instead of on mount — so each
 * section animates as it scrolls into view, never replays, and never loops.
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">. */

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.1, duration: 0.45 },
  },
}

export function RevealGroupOnView({
  className,
  children,
  amount = 0.3,
  ...rest
}: ComponentProps<typeof motion.div> & { amount?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={group}
      viewport={{ once: true, amount }}
      whileInView="show"
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  className,
  children,
  ...rest
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div className={className} variants={item} {...rest}>
      {children}
    </motion.div>
  )
}
