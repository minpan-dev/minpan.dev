"use client"

import * as React from "react"
import DOMPurify from "dompurify"
import { Autocomplete } from "@base-ui/react/autocomplete"
import { Button } from "@base-ui/react/button"
import { Dialog } from "@base-ui/react/dialog"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { Search, CornerDownLeft } from "lucide-react"
import "./SearchDialog.css"

interface SearchResult {
  url: string
  meta: { title: string }
  excerpt: string
}

interface PagefindInstance {
  search: (
    query: string
  ) => Promise<{ results: { data: () => Promise<SearchResult> }[] }>
  init?: () => Promise<void>
  destroy?: () => void
}

const SearchItem = React.memo(function SearchItem({
  result,
}: {
  result: SearchResult
}) {
  return (
    <div className="SearchItemContent">
      <span className="SearchItemTitle">{result.meta.title}</span>
      <span
        className="SearchItemExcerpt"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(result.excerpt, {
            ALLOWED_TAGS: ["mark"],
            ALLOWED_ATTR: [],
          }),
        }}
      />
    </div>
  )
})

export default function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [pagefindUnavailable, setPagefindUnavailable] = React.useState(false)
  const pagefindRef = React.useRef<PagefindInstance | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null)
  const highlightedResultRef = React.useRef<SearchResult | undefined>(undefined)

  // Detect macOS for shortcut display
  const isMac = React.useSyncExternalStore(
    () => () => {},
    () =>
      typeof navigator !== "undefined" &&
      ((navigator as Navigator & { userAgentData?: { platform: string } })
        .userAgentData?.platform === "macOS" ||
        /Mac/.test(navigator.userAgent)),
    () => true
  )

  // Load pagefind when dialog opens
  React.useEffect(() => {
    if (!open) return

    async function loadPagefind() {
      if (pagefindRef.current) return
      try {
        const pf = await import(
          /* @vite-ignore */ `${window.location.origin}/pagefind/pagefind.js`
        )
        if (pf.init) {
          await pf.init()
        }
        pagefindRef.current = pf
      } catch (error) {
        console.error("Failed to load Pagefind", error)
        // Pagefind not available in dev mode
        setPagefindUnavailable(true)
      }
    }

    loadPagefind()
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [open])

  const runSearch = React.useCallback(async (value: string) => {
    if (!pagefindRef.current || !value.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { results: rawResults } = await pagefindRef.current.search(value)
      const data = await Promise.all(
        rawResults.slice(0, 10).map((r) => r.data())
      )
      setResults(data)
    } catch (error) {
      console.error("Search failed", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleValueChange = React.useCallback(
    (value: string) => {
      setQuery(value)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        void runSearch(value)
      }, 150)
    },
    [runSearch]
  )

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setTimeout(() => {
        setQuery("")
        setResults([])
        highlightedResultRef.current = undefined
      }, 200)
    }
  }, [])

  const handleItemHighlighted = React.useCallback(
    (item: SearchResult | undefined) => {
      highlightedResultRef.current = item
    },
    []
  )

  const handleSelect = React.useCallback((item: SearchResult) => {
    setOpen(false)
    window.location.href = item.url
  }, [])

  const handleKeyDownCapture = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        (!event.metaKey && !event.ctrlKey && !event.altKey)
      ) {
        return
      }

      const highlightedResult = highlightedResultRef.current
      if (!highlightedResult) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      window.open(highlightedResult.url, "_blank", "noopener,noreferrer")
    },
    []
  )

  // Global keyboard shortcut: Ctrl/Cmd + K
  React.useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        e.stopPropagation()
        if (!open) {
          setOpen(true)
        }
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown, { capture: true })
    return () =>
      window.removeEventListener("keydown", handleGlobalKeyDown, {
        capture: true,
      })
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {/* Trigger button */}
      <Dialog.Trigger
        render={<Button className="SearchTrigger" />}
        aria-label="Search"
      >
        <Search className="SearchTriggerIcon" />
        <div className="SearchTriggerKbd">
          <kbd className="SearchTriggerCmdOrCtrl">{isMac ? "⌘" : "Ctrl"}</kbd>
          <span className="SearchTriggerPlus">+</span>
          <kbd className="SearchTriggerK">K</kbd>
        </div>
      </Dialog.Trigger>

      {/* Search Dialog */}
      <Dialog.Portal>
        <Dialog.Backdrop className="SearchBackdrop" />
        <Dialog.Viewport className="SearchViewportContained">
          <Dialog.Popup
            ref={popupRef}
            initialFocus={inputRef}
            className="SearchPopupContained"
          >
            <Dialog.Title className="sr-only">Search</Dialog.Title>

            <Autocomplete.Root
              items={results}
              onValueChange={handleValueChange}
              onItemHighlighted={handleItemHighlighted}
              onOpenChange={(next) => {
                if (!next) {
                  handleOpenChange(false)
                }
              }}
              open
              inline
              itemToStringValue={(item: SearchResult | null) =>
                item ? item.meta.title : ""
              }
              filter={null}
              autoHighlight="always"
              keepHighlight
            >
              <div className="SearchHeadContained">
                <div className="SearchInputRoot">
                  <Search className="SearchInputIcon" />
                  <Autocomplete.Input
                    id="search-input"
                    ref={inputRef}
                    placeholder="Search posts..."
                    className="SearchInput"
                    onKeyDownCapture={handleKeyDownCapture}
                  />
                </div>
              </div>

              <div className="SearchBody">
                <ScrollAreaPrimitive.Root className="SearchScrollAreaRoot">
                  <ScrollAreaPrimitive.Viewport className="SearchScrollAreaViewport">
                    <ScrollAreaPrimitive.Content style={{ minWidth: "100%" }}>
                      {loading && (
                        <div className="SearchEmptyState">Searching...</div>
                      )}

                      {!loading && pagefindUnavailable && (
                        <div className="SearchEmptyState">
                          Search is only available in production. Run{" "}
                          <code>pnpm build</code> then <code>pnpm preview</code>{" "}
                          to use search.
                        </div>
                      )}

                      {!loading &&
                        !pagefindUnavailable &&
                        query &&
                        results.length === 0 && (
                          <div className="SearchEmptyState">
                            No results found.
                          </div>
                        )}

                      {!loading && !pagefindUnavailable && !query && (
                        <div className="SearchEmptyState">
                          Type to search posts...
                        </div>
                      )}

                      {!loading && results.length > 0 && (
                        <Autocomplete.List
                          className="SearchList"
                          onKeyDownCapture={handleKeyDownCapture}
                        >
                          <Autocomplete.Collection>
                            {(result: SearchResult, i) => (
                              <Autocomplete.Item
                                key={result.url || i}
                                value={result}
                                render={
                                  <a
                                    href={result.url}
                                    onClick={(event) => {
                                      event.preventDefault()
                                      handleSelect(result)
                                    }}
                                    tabIndex={-1}
                                  />
                                }
                                className="SearchOptionItem"
                              >
                                <SearchItem result={result} />
                              </Autocomplete.Item>
                            )}
                          </Autocomplete.Collection>
                        </Autocomplete.List>
                      )}
                    </ScrollAreaPrimitive.Content>
                  </ScrollAreaPrimitive.Viewport>
                  <ScrollAreaPrimitive.Scrollbar
                    orientation="vertical"
                    className="SearchScrollbar"
                  >
                    <ScrollAreaPrimitive.Thumb className="SearchScrollbarThumb" />
                  </ScrollAreaPrimitive.Scrollbar>
                </ScrollAreaPrimitive.Root>
              </div>

              <div className="SearchFooter">
                <div className="SearchFooterHint">
                  <kbd aria-label="Enter" className="SearchFooterEnter">
                    <CornerDownLeft size={12} />
                  </kbd>
                  <span>Go to page</span>
                </div>
              </div>
            </Autocomplete.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
