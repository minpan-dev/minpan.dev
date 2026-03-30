"use client"

import { SITE } from "@/config"
import ThemeToggle from "./ThemeToggle"
import MobileNav from "./MobileNav"
import SearchDialog from "./SearchDialog"
import "./Header.css"

const navItems = [
  { href: "/posts/", label: "Posts" },
  { href: "/projects/", label: "Projects" },
  { href: "/tags/", label: "Tags" },
  { href: "/about/", label: "About" },
]

export default function Header({
  currentPath = "/",
}: {
  currentPath?: string
}) {
  const navItemsWithActive = navItems.map(({ href, label }) => ({
    href,
    label,
    active:
      currentPath === href || (href !== "/" && currentPath.startsWith(href)),
  }))

  return (
    <>
      <header className="Header">
        <nav className="HeaderInner" aria-label="Main navigation">
          <a href="/" className="HeaderLogoLink">
            {SITE.title}
          </a>

          <div className="HeaderDesktopActions">
            {navItemsWithActive.map(({ href, label, active }) => (
              <a
                key={href}
                href={href}
                className="HeaderNavLink"
                {...(active ? { "data-active": "" } : {})}
              >
                {label}
              </a>
            ))}
            <SearchDialog />
            <ThemeToggle />
          </div>

          <div className="HeaderMobileActions">
            <SearchDialog />
            <ThemeToggle />
            <MobileNav items={navItemsWithActive} />
          </div>
        </nav>
      </header>
      {/* Spacer to push content below fixed mobile header */}
      <div className="HeaderSpacer" />
    </>
  )
}
