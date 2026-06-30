import Link from "next/link"
import { ArrowRight, Globe, Mail, MapPin, Send } from "lucide-react"

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Workspaces",
    links: [
      { label: "Brand login", href: "/login?role=brand" },
      { label: "Creator login", href: "/login?role=creator" },
      { label: "Create account", href: "/register?role=brand" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#f5f3ef] px-4 pb-5 pt-4 font-sans text-[#1f252b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_18px_46px_rgba(31,37,43,0.07)]">
        <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Nepfluence home">
              <span className="grid size-8 rotate-[-35deg] grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span key={index} className="rounded-full bg-[#1f252b]" style={{ opacity: index % 2 === 0 ? 1 : 0.34 }} />
                ))}
              </span>
              <span className="text-lg font-black tracking-tight">nepfluence</span>
            </Link>
            <p className="mt-5 max-w-md text-sm font-semibold leading-6 text-[#69716b]">
              Helping brands and creators in Nepal keep discovery, outreach, campaigns, and payouts in one clean workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1f252b] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#363d43]" href="/register?role=brand">
                Start a campaign
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link className="inline-flex h-10 items-center rounded-full border border-[#ded8cf] bg-white px-4 text-sm font-black text-[#1f252b] transition hover:bg-[#f5f1ea]" href="/register?role=creator">
                Join as creator
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link className="text-sm font-bold text-[#69716b] transition hover:text-[#1f252b]" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e8e2d9] bg-[#f5f3ef] px-6 py-4 lg:px-8">
          <div className="flex flex-col gap-4 text-sm font-semibold text-[#69716b] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
              <span>© {new Date().getFullYear()} Nepfluence. All rights reserved.</span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-[#8a8175]" aria-hidden="true" />
                Kathmandu, Nepal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FooterIcon href="mailto:hello@nepfluence.com" label="Email Nepfluence" icon={Mail} />
              <FooterIcon href="https://www.instagram.com/" label="Nepfluence community" icon={Send} />
              <FooterIcon href="https://www.linkedin.com/" label="Nepfluence website" icon={Globe} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterIcon({ href, icon: Icon, label }: { href: string; icon: typeof Mail; label: string }) {
  return (
    <a className="grid size-9 place-items-center rounded-full border border-[#ded8cf] bg-white text-[#69716b] transition hover:border-[#1f252b] hover:text-[#1f252b]" href={href} aria-label={label}>
      <Icon className="size-4" aria-hidden="true" />
    </a>
  )
}
