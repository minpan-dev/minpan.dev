import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const prevUrl =
    currentPage > 1
      ? currentPage === 2
        ? basePath
        : `${basePath}${currentPage - 1}/`
      : null

  const nextUrl =
    currentPage < totalPages ? `${basePath}${currentPage + 1}/` : null

  return (
    <nav
      className="flex items-center justify-between pt-8"
      aria-label="Pagination"
    >
      <div>
        {prevUrl && (
          <Button variant="outline" render={<a href={prevUrl} />}>
            <ArrowLeft />
            Previous
          </Button>
        )}
      </div>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <div>
        {nextUrl && (
          <Button variant="outline" render={<a href={nextUrl} />}>
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </nav>
  )
}
