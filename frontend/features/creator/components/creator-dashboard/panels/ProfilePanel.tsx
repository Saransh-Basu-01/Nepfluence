"use client"

import { useEffect, useMemo, useState } from "react"
import { BadgeCheck, Camera, CheckCircle2, Edit3, Eye, Globe, Heart, KeyRound, PlayCircle, Star, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { changePassword } from "@/features/account/api/accountApi"
import { createMyCreatorProfile, updateMyCreatorProfile } from "@/features/creator-profile/api/creatorProfileApi"
import { type CreatorWorkspaceProfile } from "../creator-dashboard.shared"

const nicheOptions = ["beauty", "food", "travel", "lifestyle", "education", "fitness", "tech", "gaming", "other"]

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "CR"
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function normalizeNiche(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z]+/g, "_").replace(/^_+|_+$/g, "")
  return nicheOptions.includes(normalized) ? normalized : "other"
}

type ProfileForm = {
  creator: string
  handle: string
  niche: string
  location: string
  bio: string
}

export function ProfilePanel({
  creatorProfile,
  onProfileChange,
}: {
  creatorProfile: CreatorWorkspaceProfile
  onProfileChange: (profile: CreatorWorkspaceProfile) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [form, setForm] = useState<ProfileForm>({
    creator: creatorProfile.creator,
    handle: creatorProfile.handle,
    niche: creatorProfile.niche,
    location: creatorProfile.location,
    bio: creatorProfile.bio,
  })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })

  useEffect(() => {
    setForm({
      creator: creatorProfile.creator,
      handle: creatorProfile.handle,
      niche: creatorProfile.niche,
      location: creatorProfile.location,
      bio: creatorProfile.bio,
    })
  }, [creatorProfile])

  const profileTags = useMemo(() => {
    return [
      creatorProfile.niche,
      creatorProfile.location,
      ...creatorProfile.connectedPlatforms.map((platform) => `${platform} connected`),
    ].filter((tag) => tag && tag !== "Profile not set" && tag !== "Location not set")
  }, [creatorProfile])

  const connectionStatus = creatorProfile.connectedPlatforms.length ? "Socials connected" : "Socials not connected"

  async function saveProfile() {
    setIsSaving(true)
    setStatusMessage("")

    const updatedProfile: CreatorWorkspaceProfile = {
      ...creatorProfile,
      creator: form.creator.trim() || "Creator",
      handle: form.handle.trim() || creatorProfile.handle,
      niche: form.niche.trim() || "other",
      location: form.location.trim() || "Location not set",
      bio: form.bio.trim() || "Connect your social accounts and complete your profile to show brands what you create.",
    }

    try {
      const payload = {
        full_name: updatedProfile.creator,
        bio: updatedProfile.bio,
        niche: normalizeNiche(updatedProfile.niche),
        availability: true,
      }
      const saved = creatorProfile.profileId ? await updateMyCreatorProfile(payload) : await createMyCreatorProfile(payload)
      onProfileChange({
        ...updatedProfile,
        profileId: saved.id,
        niche: titleCase(saved.niche),
        bio: saved.bio ?? updatedProfile.bio,
        creator: saved.full_name,
      })
      setIsEditing(false)
      setStatusMessage("Profile saved.")
    } catch (error) {
      onProfileChange(updatedProfile)
      setIsEditing(false)
      setStatusMessage(error instanceof Error ? `${error.message}. Saved locally for now.` : "Saved locally for now.")
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
    setForm({
      creator: creatorProfile.creator,
      handle: creatorProfile.handle,
      niche: creatorProfile.niche,
      location: creatorProfile.location,
      bio: creatorProfile.bio,
    })
    setIsEditing(false)
    setStatusMessage("")
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_18px_46px_rgba(31,37,43,0.07)]">
        <div className="relative min-h-[300px] bg-[#e8e2d9]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf7] via-[#fbfaf7]/82 to-[#fbfaf7]/25" />

          <div className="relative flex min-h-[300px] flex-col justify-end gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative">
                <div className="grid size-28 place-items-center rounded-[28px] bg-[#1f252b] text-4xl font-black text-white shadow-[0_18px_44px_rgba(31,37,43,0.18)] ring-4 ring-white sm:size-32">
                  {initials(creatorProfile.creator)}
                </div>
                <button className="absolute -bottom-2 -right-2 grid size-10 place-items-center rounded-full bg-[#1f252b] text-white shadow-lg transition hover:bg-[#363d43]" type="button" aria-label="Change profile photo" onClick={() => setStatusMessage("Photo upload will connect when media storage is ready.")}>
                  <Camera className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-[#1f252b] ring-1 ring-[#e8e2d9]">
                  <BadgeCheck className="size-3.5 text-[#16864f]" aria-hidden="true" />
                  {connectionStatus}
                </span>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1f252b] sm:text-4xl">{creatorProfile.creator}</h2>
                <p className="mt-1 text-sm font-black text-[#69716b]">{creatorProfile.handle} / {creatorProfile.niche} / {creatorProfile.location}</p>
                <p className="mt-3 max-w-lg text-sm font-semibold leading-6 text-[#505852]">{creatorProfile.bio}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              {!isEditing ? (
                <Button className="h-10 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#363d43]" type="button" onClick={() => setIsEditing(true)}>
                  <Edit3 className="size-4" aria-hidden="true" />
                  Edit profile
                </Button>
              ) : (
                <Button className="h-10 rounded-full border-[#ded8cf] px-4 text-xs font-black text-[#505852]" variant="outline" type="button" onClick={cancelEdit}>
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
              )}
              <Button className="h-10 rounded-full border-[#ded8cf] bg-white/80 px-4 text-xs font-black text-[#1f252b]" variant="outline" type="button" onClick={() => setPreviewOpen((open) => !open)}>
                <Globe className="size-4" aria-hidden="true" />
                {previewOpen ? "Hide preview" : "Preview public profile"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-wrap gap-2">
            {(profileTags.length ? profileTags : ["Complete your profile", "Connect social accounts"]).map((tag) => (
              <span key={tag} className="rounded-full bg-[#f0ece5] px-3 py-1.5 text-xs font-black text-[#505852]">{tag}</span>
            ))}
          </div>

          {previewOpen && (
            <section className="rounded-[24px] border border-[#e8e2d9] bg-white p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Public preview</p>
              <div className="mt-4 flex flex-col gap-4 rounded-[22px] bg-[#fbfaf7] p-4 sm:flex-row sm:items-center">
                <div className="grid size-20 place-items-center rounded-[22px] bg-[#1f252b] text-2xl font-black text-white">{initials(creatorProfile.creator)}</div>
                <div>
                  <h3 className="text-lg font-black text-[#1f252b]">{creatorProfile.creator}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#69716b]">{creatorProfile.handle} / {creatorProfile.niche}</p>
                  <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#505852]">{creatorProfile.bio}</p>
                </div>
              </div>
            </section>
          )}

          <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[24px] border border-[#e8e2d9] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Profile details</p>
                  <h3 className="mt-1 text-lg font-black tracking-tight text-[#1f252b]">{isEditing ? "Edit creator profile" : "Public creator card"}</h3>
                </div>
                <Globe className="size-4 text-[#8a8175]" aria-hidden="true" />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field disabled={!isEditing} label="Display name" value={form.creator} onChange={(value) => setForm((current) => ({ ...current, creator: value }))} />
                <Field disabled={!isEditing} label="Handle" value={form.handle} onChange={(value) => setForm((current) => ({ ...current, handle: value }))} />
                <label className="text-xs font-black text-[#69716b]">
                  Category
                  <select disabled={!isEditing} className="mt-2 h-10 w-full rounded-full border border-[#ded8cf] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#505852] outline-none disabled:opacity-70 focus:border-[#1f252b]" value={normalizeNiche(form.niche)} onChange={(event) => setForm((current) => ({ ...current, niche: titleCase(event.target.value) }))}>
                    {nicheOptions.map((option) => (
                      <option key={option} value={option}>{titleCase(option)}</option>
                    ))}
                  </select>
                </label>
                <Field disabled={!isEditing} label="Location" value={form.location} onChange={(value) => setForm((current) => ({ ...current, location: value }))} />
              </div>
              <label className="mt-3 block text-xs font-black text-[#69716b]">
                Bio
                <textarea disabled={!isEditing} className="mt-2 min-h-24 w-full resize-none rounded-[18px] border border-[#ded8cf] bg-[#fbfaf7] px-4 py-3 text-sm font-semibold leading-6 text-[#505852] outline-none disabled:opacity-70 focus:border-[#1f252b]" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
              </label>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {isEditing && (
                  <Button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#363d43]" disabled={isSaving} type="button" onClick={saveProfile}>
                    {isSaving ? "Saving..." : "Save profile"}
                  </Button>
                )}
                <Button className="h-9 rounded-full border-[#ded8cf] px-4 text-xs font-black text-[#505852]" variant="outline" type="button" onClick={() => setPasswordOpen((open) => !open)}>
                  <KeyRound className="size-4" aria-hidden="true" />
                  {passwordOpen ? "Hide password" : "Change password"}
                </Button>
                {statusMessage && <p className="text-xs font-black text-[#69716b]">{statusMessage}</p>}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e8e2d9] bg-white p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Media kit</p>
              <h3 className="mt-1 text-lg font-black tracking-tight text-[#1f252b]">Creator strength</h3>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <SmallStat label="Followers" value={creatorProfile.followers} />
                <SmallStat label="Accounts" value={creatorProfile.connectedPlatforms.length.toString()} />
                <SmallStat label="Status" value={creatorProfile.connectedPlatforms.length ? "Live" : "Draft"} />
              </div>
              <div className="mt-4 space-y-2 text-sm font-semibold text-[#505852]">
                <Signal icon={Eye} text={creatorProfile.connectedPlatforms.length ? "Social metrics connected" : "Connect socials to unlock reach"} />
                <Signal icon={Heart} text={creatorProfile.niche === "Profile not set" ? "Set your content category" : `${creatorProfile.niche} category`} />
                <Signal icon={Star} text="Profile data updates after social connection" />
              </div>
            </div>
          </section>

          {passwordOpen && (
            <section className="rounded-[24px] border border-[#e8e2d9] bg-white p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Security</p>
              <h3 className="mt-1 text-lg font-black tracking-tight text-[#1f252b]">Change password</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <PasswordField label="Current password" value={passwordForm.currentPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))} />
                <PasswordField label="New password" value={passwordForm.newPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))} />
                <PasswordField label="Confirm password" value={passwordForm.confirmPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#363d43]" disabled={isChangingPassword} type="button" onClick={submitPasswordChange}>
                  {isChangingPassword ? "Changing..." : "Update password"}
                </Button>
                {passwordMessage && <p className="text-xs font-black text-[#69716b]">{passwordMessage}</p>}
              </div>
            </section>
          )}

          <section className="rounded-[24px] border border-[#e8e2d9] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Portfolio</p>
                <h3 className="mt-1 text-lg font-black tracking-tight text-[#1f252b]">Featured work</h3>
              </div>
              <Button className="h-9 rounded-full border-[#ded8cf] px-3 text-xs font-black text-[#505852]" variant="outline" type="button" onClick={() => setStatusMessage("Portfolio uploads will connect when media storage is ready.")}>
                <Upload className="size-4" aria-hidden="true" />
                Add work
              </Button>
            </div>
            <div className="mt-4 rounded-[20px] border border-dashed border-[#ded8cf] bg-[#fbfaf7] p-8 text-center">
              <PlayCircle className="mx-auto size-7 text-[#8a8175]" aria-hidden="true" />
              <p className="mt-3 text-sm font-black text-[#1f252b]">No content samples connected yet</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#69716b]">Your portfolio should stay empty until you connect social media or upload real campaign work.</p>
            </div>
          </section>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] p-5 shadow-[0_18px_46px_rgba(31,37,43,0.07)]">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Creator score</p>
          <div className="mt-4 rounded-[24px] bg-[#1f252b] p-6 text-center text-white">
            <div className="text-5xl font-black">{creatorProfile.connectedPlatforms.length ? "70" : "20"}</div>
            <p className="mt-2 text-sm font-semibold text-white/72">{creatorProfile.connectedPlatforms.length ? "Social profile started" : "Profile draft"}</p>
          </div>
          <div className="mt-4 space-y-2">
            {["Connect at least one social account", "Add recent content samples", "Complete payout verification"].map((item) => (
              <p key={item} className="flex items-center gap-2 rounded-[16px] bg-white px-3 py-3 text-sm font-semibold text-[#505852]">
                <CheckCircle2 className="size-4 text-[#16864f]" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Profile checklist</p>
          <div className="mt-4 space-y-3">
            <ChecklistItem title="Your identity" body="This profile now comes from your logged-in account, not the demo creator." />
            <ChecklistItem title="Social metrics" body="Follower and analytics values stay empty until social accounts are connected." />
            <ChecklistItem title="Match profile" body="Set your niche and portfolio so campaigns can match your real profile." />
          </div>
        </div>
      </aside>
    </section>
  )
}

function Field({ disabled, label, value, onChange }: { disabled: boolean; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-black text-[#69716b]">
      {label}
      <input className="mt-2 h-10 w-full rounded-full border border-[#ded8cf] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#505852] outline-none disabled:opacity-70 focus:border-[#1f252b]" disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-black text-[#69716b]">
      {label}
      <input className="mt-2 h-10 w-full rounded-full border border-[#ded8cf] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#505852] outline-none focus:border-[#1f252b]" type="password" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-[#f5f3ef] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a8175]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#1f252b]">{value}</p>
    </div>
  )
}

function Signal({ icon: Icon, text }: { icon: typeof Eye; text: string }) {
  return (
    <p className="flex items-center gap-2 rounded-[16px] bg-[#f5f3ef] p-3">
      <Icon className="size-4 text-[#8a8175]" aria-hidden="true" />
      {text}
    </p>
  )
}

function ChecklistItem({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-[18px] bg-white p-4">
      <h3 className="text-sm font-black text-[#1f252b]">{title}</h3>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#69716b]">{body}</p>
    </div>
  )
}
