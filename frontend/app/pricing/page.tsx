import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

const plans = [
  "Campaign drafts and publishing",
  "Creator applications and collaboration rooms",
  "Escrow workflow and payout tracking",
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-10 font-[Arial,Helvetica,sans-serif] text-[#17171f]">
      <section className="mx-auto max-w-4xl rounded-[8px] border border-[#e4e7f1] bg-white p-6 shadow-sm">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-[#6174f8]" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-black uppercase text-[#6174f8]">Pricing</p>
            <h1 className="mt-3 text-4xl font-black tracking-normal">Start with the MVP workspace.</h1>
            <p className="mt-4 text-base font-medium leading-7 text-[#606675]">
              Pricing can connect to live subscriptions later. For now, the route is wired and ready for plan logic.
            </p>
          </div>
          <div className="rounded-[8px] border border-[#edf0f6] bg-[#fbfcff] p-5">
            <p className="text-sm font-black text-[#6174f8]">Workspace plan</p>
            <div className="mt-3 text-3xl font-black">NPR 0</div>
            <p className="mt-1 text-sm font-bold text-[#727887]">During MVP buildout</p>
            <div className="mt-5 space-y-3">
              {plans.map((plan) => (
                <div key={plan} className="flex gap-2 text-sm font-bold text-[#555866]">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#16864f]" aria-hidden="true" />
                  {plan}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
