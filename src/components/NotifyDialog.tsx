"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import posthog from "posthog-js"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function NotifyDialog({ children, className }: { children: React.ReactNode; className?: string }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const h = node.getBoundingClientRect().height
      setHeight(h)
    }
  }, [submitted]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog onOpenChange={(open) => { if (open) posthog.capture("notify_dialog_opened") }}>
      <DialogTrigger render={<Button size="xl" className={className} />}>
        {children}
      </DialogTrigger>
      <DialogPopup showCloseButton={!submitted}>
        <motion.div
          animate={height ? { height } : undefined}
          transition={{ type: "spring", bounce: 0.12, duration: 0.55 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!submitted ? (
              <motion.div
                key="form"
                ref={measuredRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <DialogHeader>
                  <DialogTitle>Get early access</DialogTitle>
                  <DialogDescription>
                    Be the first to know when Honch is ready.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="flex flex-col gap-3 px-6 pb-6"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!email) return
                    setLoading(true)
                    const trimmedEmail = email.trim().toLowerCase()
                    posthog.identify(trimmedEmail, { email: trimmedEmail })
                    posthog.capture("waitlist_form_submitted", { email: trimmedEmail })
                    try {
                      await fetch("/api/notify", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-POSTHOG-DISTINCT-ID": posthog.get_distinct_id(),
                        },
                        body: JSON.stringify({ email }),
                      })
                      setSubmitted(true)
                    } catch (err) {
                      posthog.captureException(err)
                    } finally {
                      setLoading(false)
                    }
                  }}
                >
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                    required
                    className="rounded-lg border"
                  />
                  <Button type="submit" loading={loading} className="w-full">
                    Join the waitlist <ArrowRight />
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                ref={measuredRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.15 }}
                className="flex flex-col items-center gap-3 px-6 py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="flex size-12 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="size-6 text-primary-foreground" strokeWidth={3} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="font-heading text-xl font-semibold">You&apos;re on the list</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;ll reach out when Honch is ready.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogPopup>
    </Dialog>
  )
}
