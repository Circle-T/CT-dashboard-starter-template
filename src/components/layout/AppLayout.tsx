import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  Users,
  FileText,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useState } from "react"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/users", label: "Users", icon: Users },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const breadcrumb =
    navItems.find((item) =>
      item.exact
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to) && item.to !== "/"
    ) ?? navItems[0]

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0 border-r border-sidebar-border",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shrink-0">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-sm tracking-wide truncate text-sidebar-foreground">
              Starter Template
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        {sidebarOpen && (
          <>
            <Separator className="bg-sidebar-border" />
            <div className="p-4">
              <p className="text-xs text-sidebar-foreground/40">Starter Template v1.0</p>
              <p className="text-xs text-sidebar-foreground/30">Fastify + React + shadcn/ui</p>
            </div>
          </>
        )}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-6 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            {location.pathname !== "/" && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{breadcrumb.label}</span>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 h-8 w-52 text-sm"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </Button>

            <ThemeToggle />

            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                JA
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
