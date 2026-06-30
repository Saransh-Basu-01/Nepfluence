"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer"

const publicFooterRoutes = new Set(["/", "/about", "/pricing"])

export default function FooterGate() {
  const pathname = usePathname()

  if (!publicFooterRoutes.has(pathname)) {
    return null
  }

  return <Footer />
}
