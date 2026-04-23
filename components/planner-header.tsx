"use client"

import {
  Sun,
  Zap,
  Coffee,
  Briefcase,
  Moon,
  ChevronRight,
} from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  morning: <Sun className="size-3.5" />,
  "deep-work": <Zap className="size-3.5" />,
  midday: <Coffee className="size-3.5" />,
  afternoon: <Briefcase className="size-3.5" />,
  evening: <Moon className="size-3.5" />,
}

export function CategoryNav({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string
  onCategoryChange: (cat: string) => void
}) {
  const categories = [
    { id: "all", label: "All" },
    { id: "morning", label: "Morning" },
    { id: "deep-work", label: "Deep Work" },
    { id: "midday", label: "Midday" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" },
  ]

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
      role="tablist"
      aria-label="Filter routine by category"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={activeCategory === cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors md:px-3 md:py-2 md:text-sm ${
            activeCategory === cat.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          }`}
        >
          {cat.id !== "all" && categoryIcons[cat.id]}
          {cat.label}
          {activeCategory === cat.id && (
            <ChevronRight className="size-3 opacity-60" />
          )}
        </button>
      ))}
    </nav>
  )
}
