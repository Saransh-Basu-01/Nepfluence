"use client"

import { Send } from "lucide-react"
import type { MarketplaceCollaboration as Collaboration, useMarketplaceStore } from "@/features/shared/marketplaceStore"

export function MessagesPanel({
  collaborations,
  messages,
  selectedRoomId,
  message,
  onMessageChange,
  onRoomChange,
  onSend,
}: {
  collaborations: Collaboration[]
  messages: ReturnType<typeof useMarketplaceStore>["messages"]
  selectedRoomId: number
  message: string
  onMessageChange: (message: string) => void
  onRoomChange: (roomId: number) => void
  onSend: () => void
}) {
  const activeRoom = collaborations.find((collab) => collab.id === selectedRoomId) ?? collaborations[0]
  const roomMessages = messages.filter((item) => item.roomId === activeRoom?.id)

  return (
    <section className="grid min-h-[620px] gap-4 lg:grid-cols-[300px_1fr]">
      <aside className="rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] p-3 shadow-sm">
        <div className="px-2 py-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Inbox</p>
          <h2 className="mt-1 text-lg font-black text-[#1f252b]">Messages</h2>
        </div>
        <div className="space-y-2">
          {collaborations.map((collab) => (
            <button key={collab.id} className={`flex w-full items-center gap-3 rounded-[20px] p-3 text-left transition ${activeRoom?.id === collab.id ? "bg-white shadow-sm ring-1 ring-[#e8e2d9]" : "hover:bg-white/70"}`} type="button" onClick={() => onRoomChange(collab.id)}>
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#1f252b] text-xs font-black text-white">{collab.creator.charAt(0)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-[#1f252b]">{collab.creator}</span>
                <span className="block truncate text-xs font-semibold text-[#69716b]">{collab.campaign}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-sm">
        <header className="border-b border-[#e8e2d9] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Collaboration room</p>
              <h2 className="mt-1 text-xl font-black text-[#1f252b]">{activeRoom?.creator ?? "Messages"}</h2>
            </div>
            <span className="w-fit rounded-full bg-[#f0ece5] px-3 py-1 text-xs font-black text-[#505852]">
              {activeRoom?.escrow === "HELD" ? "Escrow held" : "Escrow pending"}
            </span>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          {roomMessages.map((item) => (
            <div key={item.id} className={item.sender === "brand" ? "ml-auto max-w-md" : "max-w-md"}>
              <p className="mb-1 text-[11px] font-black uppercase tracking-[0.1em] text-[#8a8175]">{item.senderName}</p>
              <p className={`rounded-[20px] px-4 py-3 text-sm font-semibold leading-6 ${item.sender === "brand" ? "bg-[#1f252b] text-white" : "bg-white text-[#505852] ring-1 ring-[#e8e2d9]"}`}>
                {item.body}
              </p>
            </div>
          ))}
          {roomMessages.length === 0 && (
            <div className="grid min-h-72 place-items-center rounded-[22px] border border-dashed border-[#ded8cf] bg-white/60 p-8 text-center">
              <div>
                <p className="text-sm font-black text-[#1f252b]">No messages yet</p>
                <p className="mt-2 text-xs font-semibold text-[#69716b]">Send the first collaboration update when escrow is ready.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-[#e8e2d9] bg-white/70 p-4">
          <input
            className="h-11 flex-1 rounded-full border border-[#ded8cf] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#1f252b] focus:ring-4 focus:ring-[#1f252b]/8"
            placeholder="Type a message..."
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSend()
            }}
          />
          <button className="grid size-11 place-items-center rounded-full bg-[#1f252b] text-white transition hover:bg-[#303840] disabled:opacity-50" type="button" aria-label="Send message" disabled={!message.trim()} onClick={onSend}>
            <Send className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
