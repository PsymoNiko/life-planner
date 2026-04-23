"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  BarChart3,
  Music,
} from "lucide-react"

export type NavSection =
  | "dashboard"
  | "routine"
  | "analytics"
  | "growth"
  | "reflect"
  | "weekly"

interface NavProps {
  active: NavSection
  onChange: (section: NavSection) => void
  hasActiveTimer?: boolean
}

const navItems: { id: NavSection; label: string; icon: typeof Clock }[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "routine", label: "Routine", icon: Clock },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "growth", label: "Growth", icon: TrendingUp },
  { id: "reflect", label: "Reflect", icon: BookOpen },
  { id: "weekly", label: "Weekly", icon: Calendar },
]

export function MobileNav({ active, onChange, hasActiveTimer }: NavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg md:hidden safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 pt-2.5 text-[10px] font-medium transition-colors min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative flex size-7 items-center justify-center rounded-lg transition-colors",
                  isActive && "bg-primary/15"
                )}
              >
                <Icon className="size-4" />
                {item.id === "routine" && hasActiveTimer && (
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function DesktopNav({ active, onChange, hasActiveTimer }: NavProps) {
  return (
    <nav
      className="hidden md:flex items-center gap-1 border-b border-border px-4 bg-card/50 overflow-x-auto"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className="size-4" />
              {item.id === "routine" && hasActiveTimer && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
