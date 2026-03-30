import { Badge } from "@/components/ui/badge"

interface TagProps {
  tag: string
  size?: "sm" | "default"
}

export default function Tag({ tag, size = "default" }: TagProps) {
  const tagSlug = tag.toLowerCase().trim()
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1)

  return (
    <Badge
      variant="outline"
      className={size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"}
      render={<a href={`/tags/${tagSlug}/`} />}
    >
      #{tagName}
    </Badge>
  )
}
