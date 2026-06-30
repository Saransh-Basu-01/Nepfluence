"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react"
import { FormEvent, useState } from "react"
import { apiClient } from "@/lib/api-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSent(false)
    setIsSubmitting(true)

    try {
      await apiClient<{ message: string }>("/api/users/forgot-password", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to send reset email")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-8 text-[#1f252b]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl place-items-center">
        <section className="grid w-full overflow-hidden rounded-[32px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_28px_80px_rgba(31,37,43,0.10)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-h-[520px] flex-col justify-between bg-[#1f252b] p-7 text-white">
            <Link className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/15 transition hover:bg-white/16" href="/login">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to login
            </Link>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">Account recovery</p>
              <h1 className="mt-4 max-w-sm text-4xl font-black tracking-tight">Reset your password securely.</h1>
              <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-white/68">
                We will email a private reset link to the address connected to your Nepfluence account.
              </p>
            </div>
            <div className="rounded-[24px] bg-white/8 p-4 ring-1 ring-white/12">
              <p className="text-xs font-semibold leading-5 text-white/70">The link expires in one hour and can only be used for password recovery.</p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#ede7dc] text-[#1f252b]">
              <MailCheck className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight">Forgot password</h2>
            <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-[#69716b]">
              Enter your account email. If it exists, the backend email engine will send reset instructions.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={submitReset}>
              <label className="text-xs font-black text-[#505852]" htmlFor="reset-email">
                Email address
                <input
                  id="reset-email"
                  name="email"
                  required
                  className="mt-2 h-12 w-full rounded-full border border-[#ded8cf] bg-white px-4 text-sm font-semibold text-[#1f252b] outline-none transition placeholder:text-[#a19a90] focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/8"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              </label>
              <button disabled={isSubmitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f252b] px-6 text-sm font-black text-white transition hover:bg-[#303840] disabled:opacity-70" type="submit">
                {isSubmitting ? "Sending..." : "Send reset link"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>

            {error && (
              <p className="mt-4 rounded-[18px] border border-[#f1b4b4] bg-[#fff7f7] px-4 py-3 text-sm font-bold text-[#9f1d1d]">
                {error}
              </p>
            )}
            {sent && (
              <p className="mt-4 rounded-[18px] border border-[#d7ccbd] bg-white px-4 py-3 text-sm font-bold text-[#505852]">
                If an account exists for {email}, a reset link has been sent.
              </p>
            )}

            <p className="mt-8 text-center text-xs font-semibold text-[#69716b]">
              Remembered it?{" "}
              <Link className="font-black text-[#1f252b] hover:text-[#505852]" href="/login">
                Return to login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
