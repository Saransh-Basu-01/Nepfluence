"use client"

import { useEffect, useSyncExternalStore } from "react"
import { apiClient } from "@/lib/api-client"

export type CampaignStatus = "DRAFT" | "OPEN" | "PAUSED" | "CLOSED" | "COMPLETED"
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED"
export type EscrowStatus = "NOT_REQUIRED" | "PENDING" | "HELD" | "RELEASED"
export type CollaborationState = "ESCROW_PENDING" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED"

export type DeliverableSubmission = {
  videoUrl: string
  postUrl: string
  caption: string
  notes: string
  aspectRatio: string
  duration: string
  submittedAt: string
  checklist: {
    briefMatched: boolean
    usageRights: boolean
    noCopyrightMusic: boolean
  }
}

export type MarketplaceCampaign = {
  id: number
  brand: string
  title: string
  niche: string
  budget: number
  country: "NP" | "IN"
  platform: string
  status: CampaignStatus
  applications: number
  accepted: number
  reach: number
  deadline: string
  brief: string
}

export type MarketplaceApplication = {
  id: number
  creator: string
  handle: string
  country: "NP" | "IN"
  niche: string
  followers: string
  match: number
  status: ApplicationStatus
  campaignId: number
}

export type MarketplaceCollaboration = {
  id: number
  campaign: string
  campaignId: number
  brand: string
  creator: string
  state: CollaborationState
  escrow: EscrowStatus
  deliverable: string
  payout: number
  submission?: DeliverableSubmission
}

export type MarketplaceMessage = {
  id: number
  roomId: number
  sender: "brand" | "creator"
  senderName: string
  body: string
  createdAt: string
}

export type CreatorDiscoveryDecision = {
  handle: string
  creator: string
  status: "SELECTED" | "REJECTED"
  decidedAt: string
}

export type MarketplaceState = {
  campaigns: MarketplaceCampaign[]
  applications: MarketplaceApplication[]
  collaborations: MarketplaceCollaboration[]
  messages: MarketplaceMessage[]
  discoveryDecisions: CreatorDiscoveryDecision[]
}

type CreatorProfile = {
  creator: string
  handle: string
  country: "NP" | "IN"
  niche: string
  followers: string
  match?: number
}

const storeKey = "nepfluence-marketplace-state-v1"
const storeEvent = "nepfluence-marketplace-updated"
let cachedState: MarketplaceState | null = null
let remoteSyncStarted = false

const initialState: MarketplaceState = {
  campaigns: [
    {
      id: 1,
      brand: "Himal Glow",
      title: "Himal Glow winter launch",
      niche: "Beauty",
      budget: 120000,
      country: "NP",
      platform: "Instagram Reels",
      status: "OPEN",
      applications: 18,
      accepted: 2,
      reach: 284000,
      deadline: "2026-06-12",
      brief: "Short UGC videos for a skincare launch with local creator voiceover.",
    },
    {
      id: 2,
      brand: "8848 Momo House",
      title: "8848 Momo House reels",
      niche: "Food",
      budget: 78000,
      country: "NP",
      platform: "TikTok",
      status: "DRAFT",
      applications: 0,
      accepted: 0,
      reach: 0,
      deadline: "2026-06-18",
      brief: "Creator visit and food reaction reels for new menu.",
    },
    {
      id: 3,
      brand: "Trail Tea",
      title: "Trail Tea creator stories",
      niche: "Lifestyle",
      budget: 95000,
      country: "IN",
      platform: "Instagram Stories",
      status: "PAUSED",
      applications: 9,
      accepted: 1,
      reach: 124000,
      deadline: "2026-06-22",
      brief: "Lifestyle story campaign for tea bundles.",
    },
  ],
  applications: [
    {
      id: 1,
      creator: "Aarati Rai",
      handle: "@aaratiugc",
      country: "NP",
      niche: "Beauty UGC",
      followers: "42K",
      match: 96,
      status: "PENDING",
      campaignId: 1,
    },
    {
      id: 2,
      creator: "Mira Shrestha",
      handle: "@miraskin",
      country: "NP",
      niche: "Skincare",
      followers: "31K",
      match: 91,
      status: "PENDING",
      campaignId: 1,
    },
    {
      id: 3,
      creator: "Kabir Rao",
      handle: "@kabircreates",
      country: "IN",
      niche: "Lifestyle",
      followers: "103K",
      match: 84,
      status: "PENDING",
      campaignId: 3,
    },
  ],
  collaborations: [
    {
      id: 1,
      campaign: "Himal Glow winter launch",
      campaignId: 1,
      brand: "Himal Glow",
      creator: "Aarati Rai",
      state: "IN_PROGRESS",
      escrow: "HELD",
      deliverable: "First draft due in 2 days",
      payout: 45000,
    },
    {
      id: 2,
      campaign: "Trail Tea creator stories",
      campaignId: 3,
      brand: "Trail Tea",
      creator: "Kabir Rao",
      state: "ESCROW_PENDING",
      escrow: "PENDING",
      deliverable: "Chat locked until escrow deposit",
      payout: 35000,
    },
  ],
  messages: [
    {
      id: 1,
      roomId: 1,
      sender: "brand",
      senderName: "Himal Glow",
      body: "Please keep the product close-up in the first 3 seconds.",
      createdAt: "2026-05-29T08:15:00.000Z",
    },
    {
      id: 2,
      roomId: 1,
      sender: "creator",
      senderName: "Aarati Rai",
      body: "Sure, I will submit the first video draft with the product hook today.",
      createdAt: "2026-05-29T08:20:00.000Z",
    },
  ],
  discoveryDecisions: [],
}

function readState(): MarketplaceState {
  if (typeof window === "undefined") return initialState

  try {
    const stored = window.localStorage.getItem(storeKey)
    return stored ? normalizeState({ ...initialState, ...JSON.parse(stored) }) : initialState
  } catch {
    return initialState
  }
}

function normalizeState(state: MarketplaceState): MarketplaceState {
  return {
    campaigns: state.campaigns.map((campaign) => ({
      ...campaign,
      brand: campaign.brand ?? campaign.title.split(" ").slice(0, 2).join(" "),
      applications: campaign.applications ?? 0,
      accepted: campaign.accepted ?? 0,
      reach: campaign.reach ?? 0,
      brief: campaign.brief ?? "Campaign brief pending.",
    })),
    applications: state.applications.map((application) => ({
      ...application,
      match: application.match ?? 90,
      status: application.status ?? "PENDING",
    })),
    collaborations: state.collaborations.map((collab) => {
      const campaign = state.campaigns.find((item) => item.title === collab.campaign || item.id === collab.campaignId)

      return {
        ...collab,
        campaignId: collab.campaignId ?? campaign?.id ?? collab.id,
        brand: collab.brand ?? campaign?.brand ?? "Brand",
        creator: collab.campaignId === 1 && collab.creator === "Sujata KC" ? "Aarati Rai" : collab.creator,
        payout: collab.payout ?? Math.min(campaign?.budget ?? 45000, 45000),
        submission: collab.submission,
      }
    }),
    messages: state.messages ?? initialState.messages,
    discoveryDecisions: state.discoveryDecisions ?? [],
  }
}

function writeState(nextState: MarketplaceState) {
  if (typeof window === "undefined") return

  cachedState = nextState
  window.localStorage.setItem(storeKey, JSON.stringify(nextState))
  window.dispatchEvent(new Event(storeEvent))
}

async function loadRemoteState() {
  try {
    const remoteState = await apiClient<MarketplaceState>("/api/marketplace/state")
    writeState(normalizeState(remoteState))
  } catch {
    remoteSyncStarted = false
    return
  }
}

async function persistRemoteState(nextState: MarketplaceState) {
  try {
    const remoteState = await apiClient<MarketplaceState>("/api/marketplace/state", {
      method: "PUT",
      body: JSON.stringify(nextState),
    })
    writeState(normalizeState(remoteState))
  } catch {
    return
  }
}

function getSnapshot() {
  cachedState ??= readState()
  return cachedState
}

function getServerSnapshot() {
  return initialState
}

function subscribe(onStoreChange: () => void) {
  function syncState() {
    cachedState = readState()
    onStoreChange()
  }

  window.addEventListener(storeEvent, syncState)
  window.addEventListener("storage", syncState)

  return () => {
    window.removeEventListener(storeEvent, syncState)
    window.removeEventListener("storage", syncState)
  }
}

export function useMarketplaceStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function commit(updater: (current: MarketplaceState) => MarketplaceState) {
    const nextState = updater(readState())
    writeState(nextState)
    void persistRemoteState(nextState)
  }

  useEffect(() => {
    if (remoteSyncStarted) return
    remoteSyncStarted = true
    void loadRemoteState()
  }, [])

  return {
    ...state,
    createCampaign(campaign: Omit<MarketplaceCampaign, "id" | "brand"> & { brand?: string }) {
      commit((current) => ({
        ...current,
        campaigns: [{ ...campaign, id: Date.now(), brand: campaign.brand ?? "Himal Glow" }, ...current.campaigns],
      }))
    },
    publishCampaign(id: number) {
      commit((current) => ({
        ...current,
        campaigns: current.campaigns.map((campaign) =>
          campaign.id === id
            ? { ...campaign, status: "OPEN", applications: Math.max(campaign.applications, 3), reach: Math.max(campaign.reach, 22000) }
            : campaign,
        ),
      }))
    },
    applyToCampaign(campaignId: number, creator: CreatorProfile) {
      commit((current) => {
        const alreadyApplied = current.applications.some((application) => application.campaignId === campaignId && application.handle === creator.handle)
        if (alreadyApplied) return current

        return {
          ...current,
          campaigns: current.campaigns.map((campaign) =>
            campaign.id === campaignId ? { ...campaign, applications: campaign.applications + 1 } : campaign,
          ),
          applications: [
            {
              id: Date.now(),
              creator: creator.creator,
              handle: creator.handle,
              country: creator.country,
              niche: creator.niche,
              followers: creator.followers,
              match: creator.match ?? 92,
              status: "PENDING",
              campaignId,
            },
            ...current.applications,
          ],
        }
      })
    },
    withdrawApplication(campaignId: number, handle: string) {
      commit((current) => {
        const application = current.applications.find((item) => item.campaignId === campaignId && item.handle === handle)

        return {
          ...current,
          campaigns: application
            ? current.campaigns.map((campaign) =>
                campaign.id === campaignId ? { ...campaign, applications: Math.max(0, campaign.applications - 1) } : campaign,
              )
            : current.campaigns,
          applications: current.applications.filter((item) => !(item.campaignId === campaignId && item.handle === handle)),
        }
      })
    },
    reviewApplication(id: number, status: ApplicationStatus) {
      commit((current) => {
        const application = current.applications.find((item) => item.id === id)
        const campaign = current.campaigns.find((item) => item.id === application?.campaignId)
        const wasAccepted = application?.status === "ACCEPTED"
        const isAccepted = status === "ACCEPTED"

        return {
          ...current,
          applications: current.applications.map((item) => (item.id === id ? { ...item, status } : item)),
          campaigns: current.campaigns.map((item) =>
            item.id === application?.campaignId ? { ...item, accepted: Math.max(0, item.accepted + (isAccepted && !wasAccepted ? 1 : 0)) } : item,
          ),
          collaborations:
            application && campaign && isAccepted && !current.collaborations.some((item) => item.campaignId === campaign.id && item.creator === application.creator)
              ? [
                  {
                    id: Date.now(),
                    campaign: campaign.title,
                    campaignId: campaign.id,
                    brand: campaign.brand,
                    creator: application.creator,
                    state: "ESCROW_PENDING",
                    escrow: "PENDING",
                    deliverable: "Escrow required before chat unlocks",
                    payout: Math.min(campaign.budget, Math.max(15000, Math.round(campaign.budget * 0.38))),
                  },
                  ...current.collaborations,
                ]
              : current.collaborations,
          messages: current.messages,
        }
      })
    },
    depositEscrow(id: number) {
      commit((current) => ({
        ...current,
        collaborations: current.collaborations.map((collab) =>
          collab.id === id ? { ...collab, state: "IN_PROGRESS", escrow: "HELD", deliverable: "Chat unlocked. Waiting for first deliverable." } : collab,
        ),
      }))
    },
    markSubmitted(id: number, submission?: Omit<DeliverableSubmission, "submittedAt">) {
      commit((current) => ({
        ...current,
        collaborations: current.collaborations.map((collab) =>
          collab.id === id
            ? {
                ...collab,
                state: "SUBMITTED",
                deliverable: "Video deliverable submitted. Waiting for brand review.",
                submission: submission
                  ? {
                      ...submission,
                      submittedAt: new Date().toISOString(),
                    }
                  : collab.submission ?? {
                      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                      postUrl: "https://www.instagram.com/reel/demo",
                      caption: "Campaign draft video submitted for brand review.",
                      notes: "Demo submission created from brand-side simulation.",
                      aspectRatio: "9:16",
                      duration: "30s",
                      submittedAt: new Date().toISOString(),
                      checklist: {
                        briefMatched: true,
                        usageRights: true,
                        noCopyrightMusic: true,
                      },
                    },
              }
            : collab,
        ),
      }))
    },
    approveDeliverable(id: number) {
      commit((current) => ({
        ...current,
        collaborations: current.collaborations.map((collab) =>
          collab.id === id ? { ...collab, state: "APPROVED", escrow: "RELEASED", deliverable: "Approved. Payout queued." } : collab,
        ),
      }))
    },
    sendMessage(roomId: number, message: Omit<MarketplaceMessage, "id" | "roomId" | "createdAt">) {
      commit((current) => ({
        ...current,
        messages: [
          ...current.messages,
          {
            ...message,
            id: Date.now(),
            roomId,
            createdAt: new Date().toISOString(),
          },
        ],
      }))
    },
    decideCreatorDiscovery(creator: Pick<CreatorDiscoveryDecision, "creator" | "handle">, status: CreatorDiscoveryDecision["status"]) {
      commit((current) => ({
        ...current,
        discoveryDecisions: [
          {
            creator: creator.creator,
            handle: creator.handle,
            status,
            decidedAt: new Date().toISOString(),
          },
          ...current.discoveryDecisions.filter((decision) => decision.handle !== creator.handle),
        ],
      }))
    },
  }
}
