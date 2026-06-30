/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  Globe,
  IndianRupee,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Megaphone,
  MoreHorizontal,
  PlayCircle,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Upload,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react"
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { changePassword, updateAccount } from "@/features/account/api/accountApi"
import { createMyBrandProfile, getMyBrandProfile, updateMyBrandProfile } from "@/features/brand-profile/api/brandProfileApi"
import { readMockSession, updateStoredSession } from "@/lib/auth"
import {
  MarketplaceApplication as Application,
  MarketplaceCampaign as Campaign,
  MarketplaceCollaboration as Collaboration,
  ApplicationStatus,
  useMarketplaceStore,
} from "@/features/shared/marketplaceStore"
import {
  type Activity,
  type Creator,
  creatorAnalytics,
  creatorImage,
  creatorWorkSamples,
  campaignImage,
  money,
  statusClass,
} from "../brand-dashboard.shared"

import { MiniReviewStat } from "./ReviewStats"

function titleFromEmail(email?: string) {
  const base = email?.split("@")[0] || "Untitled brand"
  return base
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "BR"
}

export function BrandProfilePanel({ campaigns, collaborations }: { campaigns: Campaign[]; collaborations: Collaboration[] }) {
  const session = readMockSession()
  const defaultBrandName = session?.username || titleFromEmail(session?.email)
  const liveCampaigns = campaigns.filter((campaign) => campaign.status === "OPEN").length
  const totalSpend = collaborations.reduce((sum, collab) => sum + collab.payout, 0)
  const [profileId, setProfileId] = useState<number | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [accountForm, setAccountForm] = useState({
    username: defaultBrandName,
    email: session?.email ?? "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [form, setForm] = useState({
    company_name: defaultBrandName,
    industry: "",
    website: "",
    company_size: "Kathmandu, Nepal",
    description: "Add your brand story so creators understand your campaign style.",
  })

  async function loadProfile() {
    if (profileLoaded) return
    setProfileLoaded(true)
    try {
      const profile = await getMyBrandProfile()
      if (!profile) return
      setProfileId(profile.id)
      setForm({
        company_name: profile.company_name,
        industry: profile.industry ?? "",
        website: profile.website ?? "",
        company_size: profile.company_size ?? "",
        description: profile.description ?? "",
      })
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to load brand profile.")
    }
  }

  async function saveProfile() {
    setIsSaving(true)
    setStatusMessage("")
    try {
      if (session?.userId && session.accessToken) {
        const account = await updateAccount(session.userId, {
          username: accountForm.username.trim() || form.company_name.trim() || "Untitled brand",
          email: accountForm.email.trim() || session.email,
        })
        updateStoredSession({
          username: account.username,
          email: account.email,
        })
      }

      const payload = {
        company_name: form.company_name.trim() || "Untitled brand",
        industry: form.industry.trim() || undefined,
        website: form.website.trim() || undefined,
        company_size: form.company_size.trim() || undefined,
        description: form.description.trim() || undefined,
      }
      const profile = profileId ? await updateMyBrandProfile(payload) : await createMyBrandProfile(payload)
      setProfileId(profile.id)
      setIsEditing(false)
      setStatusMessage("Brand profile and account details saved.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save brand profile.")
    } finally {
      setIsSaving(false)
    }
  }

  async function submitPasswordChange() {
    setPasswordMessage("")
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New password and confirmation do not match.")
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setPasswordMessage("Password changed successfully.")
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Unable to change password.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  function cancelEdit() {
    setAccountForm({
      username: session?.username || defaultBrandName,
      email: session?.email ?? "",
    })
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setPasswordMessage("")
    setStatusMessage("")
    setIsEditing(false)
  }

  useEffect(() => {
    void loadProfile()
  }, [])

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-sm">
        <div className="grid gap-5 border-b border-[#e8e2d9] p-5 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col justify-between gap-8">
            <div className="flex items-start gap-4">
              <div className="grid size-20 place-items-center rounded-[18px] border border-[#e8e2d9] bg-white text-2xl font-black tracking-tight text-[#1f252b] shadow-sm">
                {initials(form.company_name)}
              </div>
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1 rounded-full bg-[#f0ece5] px-2.5 py-1 text-[11px] font-black text-[#4d5751]">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Verified brand
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1f252b]">{form.company_name}</h2>
                <p className="mt-1 text-sm font-semibold text-[#69716b]">{form.industry || "Industry not set"} - {form.company_size || "Location not set"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#303840]"
                type="button"
                onClick={() => {
                  if (isEditing) {
                    cancelEdit()
                    return
                  }
                  setIsEditing(true)
                  setStatusMessage("")
                }}
              >
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                {isEditing ? "Cancel edit" : "Edit profile"}
              </Button>
              <Button
                className="h-9 rounded-full border-[#ded8cf] px-4 text-xs font-black text-[#1f252b]"
                variant="outline"
                type="button"
                onClick={() => setPreviewOpen((open) => !open)}
              >
                <Globe className="size-3.5" aria-hidden="true" />
                {previewOpen ? "Hide preview" : "Preview public page"}
              </Button>
            </div>
          </div>

          <div className="min-h-52 overflow-hidden rounded-[22px] border border-[#e8e2d9] bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1100&q=80)" }}>
            <div className="flex h-full items-end bg-gradient-to-t from-[#1f252b]/45 to-transparent p-4">
              <p className="max-w-xs text-sm font-semibold leading-6 text-white">{form.description || "Add a brand story to help creators understand your campaign."}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
            <div className="rounded-[22px] border border-[#e8e2d9] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black tracking-tight">{isEditing ? "Edit brand workspace" : "Business details"}</h3>
                  {isEditing && <p className="mt-1 text-xs font-semibold text-[#69716b]">Update account, public brand profile, and password from one place.</p>}
                </div>
                <Building2 className="size-4 text-[#8a8175]" aria-hidden="true" />
              </div>
              {isEditing && (
                <div className="mt-4 rounded-[18px] border border-[#e8e2d9] bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Account details</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <BrandField disabled={false} label="Account name" value={accountForm.username} onChange={(value) => setAccountForm((current) => ({ ...current, username: value }))} />
                    <BrandField disabled={false} label="Login email" value={accountForm.email} onChange={(value) => setAccountForm((current) => ({ ...current, email: value }))} />
                  </div>
                </div>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <BrandField disabled={!isEditing} label="Brand name" value={form.company_name} onChange={(value) => setForm((current) => ({ ...current, company_name: value }))} />
                <BrandField disabled={!isEditing} label="Industry" value={form.industry} onChange={(value) => setForm((current) => ({ ...current, industry: value }))} />
                <BrandField disabled={!isEditing} label="Website" value={form.website} onChange={(value) => setForm((current) => ({ ...current, website: value }))} />
                <BrandField disabled={!isEditing} label="Location" value={form.company_size} onChange={(value) => setForm((current) => ({ ...current, company_size: value }))} />
              </div>
              <label className="mt-3 block text-xs font-black text-[#505852]">
                Brand story
                <textarea
                  className="mt-2 min-h-24 w-full resize-none rounded-[16px] border border-[#ded8cf] bg-[#fbfaf7] px-3 py-3 text-sm font-semibold leading-6 outline-none disabled:opacity-70 focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/5"
                  disabled={!isEditing}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#303840]" type="button" onClick={saveProfile} disabled={isSaving || !isEditing}>{isSaving ? "Saving..." : "Save profile"}</Button>
                {statusMessage && <p className="text-xs font-black text-[#69716b]">{statusMessage}</p>}
              </div>

              {isEditing && (
                <div className="mt-4 rounded-[18px] border border-[#e8e2d9] bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Password</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <PasswordField label="Current password" value={passwordForm.currentPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))} />
                    <PasswordField label="New password" value={passwordForm.newPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))} />
                    <PasswordField label="Confirm password" value={passwordForm.confirmPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button className="h-9 rounded-full border-[#ded8cf] px-4 text-xs font-black text-[#1f252b]" variant="outline" type="button" onClick={submitPasswordChange} disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing..." : "Change password"}
                    </Button>
                    {passwordMessage && <p className="text-xs font-black text-[#69716b]">{passwordMessage}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[22px] border border-[#e8e2d9] bg-white p-4">
              <h3 className="text-base font-black tracking-tight">Brand trust</h3>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniReviewStat label="Live" value={liveCampaigns.toString()} />
                <MiniReviewStat label="Spend" value={money(totalSpend)} />
                <MiniReviewStat label="Rating" value="4.8" />
              </div>
              <div className="mt-4 space-y-2 text-xs font-bold text-[#505852]">
                <p className="flex items-center gap-2 rounded-[16px] bg-[#fbfaf7] p-3"><ShieldCheck className="size-4 text-[#16864f]" /> Escrow-backed collaborations</p>
                <p className="flex items-center gap-2 rounded-[16px] bg-[#fbfaf7] p-3"><BadgeCheck className="size-4 text-[#1f252b]" /> Verified campaign owner</p>
                <p className="flex items-center gap-2 rounded-[16px] bg-[#fbfaf7] p-3"><Star className="size-4 fill-[#b78c35] text-[#b78c35]" /> Strong creator response quality</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-[#e8e2d9] bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-black tracking-tight">Creator brief preferences</h3>
                <p className="mt-1 text-xs font-semibold text-[#69716b]">This helps creators understand the brand before applying.</p>
              </div>
              <span className="rounded-full bg-[#f0ece5] px-3 py-1 text-[11px] font-black text-[#505852]">Public to creators</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                "Natural product close-ups in first 3 seconds.",
                "Creator voiceover preferred over heavy text overlays.",
                "No exaggerated medical claims or copyrighted sounds.",
              ].map((rule) => (
                <div key={rule} className="rounded-[18px] bg-[#fbfaf7] p-4 text-xs font-semibold leading-5 text-[#505852]">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className={`rounded-[22px] border border-[#e8e2d9] bg-[#fbfaf7] p-4 shadow-sm ${previewOpen ? "ring-4 ring-[#1f252b]/10" : ""}`}>
          <h3 className="text-base font-black tracking-tight">Public preview</h3>
          <div className="mt-3 overflow-hidden rounded-[20px] border border-[#e8e2d9] bg-white">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80)" }} />
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-[14px] bg-[#1f252b] text-xs font-black text-white">{initials(form.company_name)}</div>
                <div>
                  <p className="text-sm font-black">{form.company_name}</p>
                  <p className="text-xs font-semibold text-[#69716b]">{form.industry || "Brand"}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold leading-5 text-[#505852]">
                {form.description || "Add a short brand story to help creators understand your campaign style."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#e8e2d9] bg-[#fbfaf7] p-4 shadow-sm">
          <h3 className="text-base font-black tracking-tight">Profile completeness</h3>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e8e2d9]">
            <div className="h-full w-[86%] rounded-full bg-[#1f252b]" />
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-[#69716b]">86% complete. Add legal billing details and campaign media kit.</p>
        </div>
      </aside>
    </section>
  )
}

function BrandField({ disabled, label, value, onChange }: { disabled: boolean; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-black text-[#505852]">
      {label}
      <input className="mt-2 h-9 w-full rounded-[14px] border border-[#ded8cf] bg-[#fbfaf7] px-3 text-sm font-semibold outline-none disabled:opacity-70 focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/5" disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-black text-[#505852]">
      {label}
      <input className="mt-2 h-9 w-full rounded-[14px] border border-[#ded8cf] bg-white px-3 text-sm font-semibold outline-none focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/5" type="password" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
