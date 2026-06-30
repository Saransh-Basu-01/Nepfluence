"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react"
import { FormEvent, Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!token) {
      setError("Reset token is missing. Please request a new reset link.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiClient<{ message: string }>("/api/users/reset-password", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      })
      setSuccess(response.message || "Password reset successfully.")
      setPassword("")
      setConfirmPassword("")
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to reset password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full max-w-md rounded-[32px] border border-[#e8e2d9] bg-[#fbfaf7] p-7 shadow-[0_28px_80px_rgba(31,37,43,0.10)] sm:p-9">
      <Link className="inline-flex items-center gap-2 rounded-full bg-[#ede7dc] px-4 py-2 text-xs font-black text-[#1f252b] transition hover:bg-[#e4ddd2]" href="/login">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to login
      </Link>
      <div className="mt-8 grid size-12 place-items-center rounded-2xl bg-[#1f252b] text-white">
        <KeyRound className="size-5" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-[#1f252b]">Create a new password</h1>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#69716b]">
        Choose a strong password for your Nepfluence account.
      </p>

      <form className="mt-8 grid gap-4" onSubmit={submitPassword}>
        <label className="text-xs font-black text-[#505852]" htmlFor="new-password">
          New password
          <input
            id="new-password"
            className="mt-2 h-12 w-full rounded-full border border-[#ded8cf] bg-white px-4 text-sm font-semibold text-[#1f252b] outline-none transition focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/8"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <label className="text-xs font-black text-[#505852]" htmlFor="confirm-password">
          Confirm password
          <input
            id="confirm-password"
            className="mt-2 h-12 w-full rounded-full border border-[#ded8cf] bg-white px-4 text-sm font-semibold text-[#1f252b] outline-none transition focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/8"
            minLength={8}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
        </label>
        <button className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f252b] px-6 text-sm font-black text-white transition hover:bg-[#303840] disabled:opacity-70" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Reset password"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-[18px] border border-[#f1b4b4] bg-[#fff7f7] px-4 py-3 text-sm font-bold text-[#9f1d1d]">
          {error}
        </p>
      )}
      {success && (
        <div className="mt-4 rounded-[18px] border border-[#d7ccbd] bg-white px-4 py-3 text-sm font-bold text-[#505852]">
          <p className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#16864f]" aria-hidden="true" />
            {success}
          </p>
          <Link className="mt-3 inline-flex font-black text-[#1f252b] hover:text-[#505852]" href="/login">
            Login with new password
          </Link>
        </div>
      )}
    </section>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f3ed] px-5 py-8">
      <Suspense fallback={<div className="text-sm font-black text-[#1f252b]">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
