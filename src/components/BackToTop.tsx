import { ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY >= 200)
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    toggleVisibility()

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <Button
      ref={btnRef}
      variant="outline"
      size="icon"
      className="fixed right-8 bottom-8 z-50 shadow-sm transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(0.75rem)",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-label="Back to top"
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp className="size-5" />
    </Button>
  )
}
