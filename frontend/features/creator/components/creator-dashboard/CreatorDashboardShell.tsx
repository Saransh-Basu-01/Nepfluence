"use client"

import Link from "next/link"
import { Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import { type Section, navItems } from "./creator-dashboard.shared"

type CreatorDashboardShellProps = {
  activeSection: Section
  mobileMenuOpen: boolean
  onCloseMobileMenu: () => void
  onFindCampaigns: () => void
  onNavigate: (section: Section) => void
  onOpenMobileMenu: () => void
  onOpenNotifications: () => void
  children: ReactNode
}

export function CreatorDashboardShell({
  activeSection,
  children,
  mobileMenuOpen,
  onCloseMobileMenu,
  onFindCampaigns,
  onNavigate,
  onOpenMobileMenu,
  onOpenNotifications,
}: CreatorDashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()

  function signOut() {
    logout()
    router.replace("/login?role=creator")
  }

  const shell = (
    <aside className="flex h-full flex-col bg-[#fbfaf7]">
      <div className={`flex h-14 items-center border-b border-[#e8e2d9] ${sidebarCollapsed ? "justify-center px-2" : "justify-between gap-3 px-4"}`}>
        <Link href="/" className={`flex min-w-0 items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`} aria-label="Nepfluence home">
          <span className="grid size-8 shrink-0 rotate-[-35deg] grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className="rounded-full bg-[#1f252b]" style={{ opacity: index % 2 === 0 ? 1 : 0.34 }} />
            ))}
          </span>
          {!sidebarCollapsed && <span className="truncate text-[15px] font-black tracking-tight text-[#1f252b]">Nepfluence</span>}
        </Link>
        {!sidebarCollapsed && (
          <button
            className="grid size-8 place-items-center rounded-full border border-[#ded8cf] text-[#6d746f] transition hover:bg-[#f2eee8]"
            type="button"
            aria-label="Collapse sidebar"
            onClick={() => setSidebarCollapsed(true)}
          >
            <PanelLeftClose className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <div className="border-b border-[#e8e2d9] px-2 py-3">
          <button
            className="grid size-9 w-full place-items-center rounded-full border border-[#ded8cf] text-[#6d746f] transition hover:bg-[#f2eee8]"
            type="button"
            aria-label="Expand sidebar"
            title="Expand sidebar"
            onClick={() => setSidebarCollapsed(false)}
          >
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <nav className={`flex-1 space-y-1 py-4 ${sidebarCollapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className={`flex w-full items-center rounded-full py-2 text-left text-[13px] font-bold transition ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} ${
                activeSection === item.label ? "bg-[#1f252b] text-white" : "text-[#5f6762] hover:bg-[#f2eee8] hover:text-[#1f252b]"
              }`}
              type="button"
              title={sidebarCollapsed ? item.label : undefined}
              aria-label={item.label}
              onClick={() => onNavigate(item.label)}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!sidebarCollapsed && item.label}
            </button>
          )
        })}
      </nav>

      {!sidebarCollapsed && <div className="border-t border-[#e8e2d9] p-3">
        <div className="rounded-[22px] border border-[#e2dccf] bg-[#f5f1ea] p-3 text-[#1f252b]">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Creator workflow</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-[#505852]">Apply, wait for acceptance, work after escrow, then submit and get paid.</p>
        </div>
      </div>}
    </aside>
  )

  return (
    <main className="min-h-screen bg-[#f5f3ef] font-sans text-[#1f252b]">
      <div className="flex min-h-screen">
        <div className={`hidden shrink-0 border-r border-[#e8e2d9] transition-[width] duration-200 lg:block ${sidebarCollapsed ? "w-[72px]" : "w-[236px]"}`}>{shell}</div>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-black/32" type="button" aria-label="Close menu" onClick={onCloseMobileMenu} />
            <div className="relative h-full w-[min(320px,88vw)] shadow-2xl">{shell}</div>
          </div>
        )}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-[#e8e2d9] bg-[#fbfaf7]/92 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <button className="grid size-9 place-items-center rounded-full border border-[#ded8cf] bg-white lg:hidden" type="button" aria-label="Open mobile menu" onClick={onOpenMobileMenu}>
                  <Menu className="size-5" aria-hidden="true" />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a8175]">Creator workspace</p>
                  <h1 className="truncate text-xl font-black tracking-tight">{activeSection}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="grid size-9 place-items-center rounded-full border border-[#ded8cf] bg-white" type="button" aria-label="Notifications" onClick={onOpenNotifications}>
                  <Bell className="size-4" aria-hidden="true" />
                </button>
                <button className="hidden h-9 items-center gap-2 rounded-full border border-[#ded8cf] bg-white px-3 text-xs font-bold text-[#505852] sm:inline-flex" type="button" onClick={signOut}>
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-full bg-[#1f252b] px-3.5 text-xs font-black text-white shadow-[0_10px_20px_rgba(31,37,43,0.14)]" type="button" onClick={onFindCampaigns}>
                  <Search className="size-4" aria-hidden="true" />
                  Find campaigns
                </button>
              </div>
            </div>
          </header>
          <div className="px-4 py-4 lg:px-5">{children}</div>
        </section>
      </div>
    </main>
  )
}
