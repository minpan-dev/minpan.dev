"use client"

import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import "./MobileNav.css"

interface NavItem {
  href: string
  label: string
  active: boolean
}

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [clipped, setClipped] = useState(false)

  // Track scroll to show/hide top border
  const handleScroll = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    setClipped(el.scrollTop > 4)
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el || !open) return
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [open, handleScroll])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="HeaderIconButton sm:hidden"
        aria-label="Open navigation"
      >
        <span className="MobileNavTriggerBars" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="MobileNavBackdrop" />
        <Dialog.Popup className="MobileNavPopup">
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>

          <div
            ref={viewportRef}
            className="MobileNavViewport"
            {...(clipped ? { "data-clipped": "" } : {})}
          >
            <div className="MobileNavViewportInner">
              {/* Tap area to close */}
              <div
                className="MobileNavPanel"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <div className="MobileNavCloseContainer">
                  <Dialog.Close
                    className="MobileNavClose"
                    aria-label="Close navigation"
                  >
                    <X size={14} />
                  </Dialog.Close>
                </div>

                {/* Nav links */}
                <nav aria-label="Mobile navigation">
                  <div className="MobileNavSection">
                    <div className="MobileNavHeading">Navigation</div>
                    {items.map(({ href, label, active }) => (
                      <div key={href} className="MobileNavItem">
                        <a
                          href={href}
                          className="MobileNavLink"
                          {...(active ? { "data-active": "" } : {})}
                          onClick={() => setOpen(false)}
                        >
                          {label}
                        </a>
                      </div>
                    ))}
                  </div>
                </nav>
              </div>

              <div className="MobileNavBottomOverscroll" />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
