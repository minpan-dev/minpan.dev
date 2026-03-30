import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Post {
  id: string
  data: { title: string }
}

interface PrevNextNavProps {
  prevPost?: Post | null
  nextPost?: Post | null
}

export default function PrevNextNav({ prevPost, nextPost }: PrevNextNavProps) {
  if (!prevPost && !nextPost) return null

  return (
    <nav
      className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between"
      aria-label="Post navigation"
    >
      <div className="flex-1">
        {prevPost && (
          <a
            href={`/posts/${prevPost.id}/`}
            className="group block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Card className="transition-all duration-150 group-hover:shadow-md group-hover:ring-primary/30">
              <div className="flex items-center gap-3 px-4">
                <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:-translate-x-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Previous
                  </span>
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {prevPost.data.title}
                  </span>
                </div>
              </div>
            </Card>
          </a>
        )}
      </div>
      <div className="flex-1">
        {nextPost && (
          <a
            href={`/posts/${nextPost.id}/`}
            className="group block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Card className="transition-all duration-150 group-hover:shadow-md group-hover:ring-primary/30">
              <div className="flex items-center justify-end gap-3 px-4">
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-muted-foreground">Next</span>
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {nextPost.data.title}
                  </span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
            </Card>
          </a>
        )}
      </div>
    </nav>
  )
}
