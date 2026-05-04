import { useQuery } from "@tanstack/react-query"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  BarChart2,
  LayoutDashboard,
  Plug,
  ShieldCheck,
  LogIn,
  UserCircle2,
  Lock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/lib/theme"

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const areaData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6100 },
  { month: "Jun", revenue: 8400 },
  { month: "Jul", revenue: 9200 },
]

const barData = [
  { day: "Mon", value: 32 },
  { day: "Tue", value: 48 },
  { day: "Wed", value: 41 },
  { day: "Thu", value: 63 },
  { day: "Fri", value: 57 },
  { day: "Sat", value: 29 },
  { day: "Sun", value: 18 },
]

const recentActivity = [
  { id: "1", user: "Alice Chen",  initials: "AC", action: "Created new report",       time: "2 min ago",  type: "create" },
  { id: "2", user: "Ben Torres",  initials: "BT", action: "Updated user settings",    time: "14 min ago", type: "update" },
  { id: "3", user: "Cleo Park",   initials: "CP", action: "Deleted draft item",       time: "1 hr ago",   type: "delete" },
  { id: "4", user: "Dan Wright",  initials: "DW", action: "Exported analytics data",  time: "3 hr ago",   type: "export" },
  { id: "5", user: "Eva Mills",   initials: "EM", action: "Invited 3 team members",   time: "5 hr ago",   type: "invite" },
]

const goals = [
  { label: "Monthly revenue",  current: 9200, target: 12000 },
  { label: "New users",        current: 590,  target: 750 },
  { label: "Active sessions",  current: 312,  target: 400 },
]

type ActivityType = "create" | "update" | "delete" | "export" | "invite"

const activityBadge: Record<ActivityType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  create: { label: "Create", variant: "default" },
  update: { label: "Update", variant: "secondary" },
  delete: { label: "Delete", variant: "destructive" },
  export: { label: "Export", variant: "outline" },
  invite: { label: "Invite", variant: "outline" },
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
interface StatCardProps {
  title: string
  value: string
  change: string
  positive: boolean
  icon: React.ElementType
  description: string
}

function StatCard({ title, value, change, positive, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {positive ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={`text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const chartTextColor = isDark ? "#94a3b8" : "#64748b"
  const chartGridColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"

  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await fetch("/api/health")
      if (!res.ok) throw new Error("Health check failed")
      return res.json() as Promise<{ status: string; timestamp: string }>
    },
  })

  return (
    <div className="p-6 space-y-6">
      {/* Get-started banner */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground">Welcome to Dark Factory Starter 🏭</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Your app is ready. This dashboard is a fully working starting point — charts, stats, navigation, light/dark theme, and a backend API are already wired up.{" "}
              <span className="font-medium text-foreground">Just describe what you want to build and Forge AI will do it.</span>
            </p>

            {/* Feature tiles */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Pages & navigation",
                  desc: "Ask for new pages, a sidebar link, a settings screen, or a data table.",
                },
                {
                  icon: BarChart2,
                  title: "Charts & visualisations",
                  desc: "Request bar charts, line graphs, KPI cards, or any metric you track.",
                },
                {
                  icon: Plug,
                  title: "APIs & data",
                  desc: "Connect a database, call an external API, or add backend business logic.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-lg border border-border bg-card p-3 flex gap-3 items-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                    <Icon className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sample prompts */}
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Try prompting:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Add a Users page with a searchable table",
                  "Replace the chart with real API data",
                  "Add a settings page with a form",
                  "Change the sidebar to match my brand",
                ].map((prompt) => (
                  <span
                    key={prompt}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/5 px-3 py-1 text-xs text-blue-500 font-medium"
                  >
                    <Sparkles className="h-3 w-3 shrink-0" />
                    {prompt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication guide card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-foreground">Add authentication to your app</h2>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 ring-1 ring-emerald-500/20">
                Recommended
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              This template is ready to connect to{" "}
              <span className="font-medium text-foreground">Microsoft Entra ID</span> (Azure AD) — the same identity provider used across Microsoft 365, Teams, and Azure. Once set up, your users log in with their work account, and every API call is automatically secured.
            </p>

            {/* What auth gives you */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: LogIn,
                  title: "Login & logout",
                  desc: "Users sign in with their Microsoft work account. No passwords to manage.",
                },
                {
                  icon: UserCircle2,
                  title: "User identity",
                  desc: "Access the logged-in user's name, email, and avatar anywhere in the app.",
                },
                {
                  icon: Lock,
                  title: "Protected routes",
                  desc: "Pages and API endpoints are locked — only authenticated users can access them.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-lg border border-border bg-background p-3 flex gap-3 items-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                    <Icon className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* What you need */}
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-amber-600 mb-1">Before you start — you'll need:</p>
              <ul className="space-y-1">
                {[
                  "An Azure account with permission to register apps (ask your IT admin if unsure)",
                  "A Client ID and Tenant ID from your Entra App Registration",
                  "Those two values added to your project's Env panel",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample prompts */}
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Prompt Forge AI to set it up:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Add Microsoft Entra ID login to this app",
                  "Protect all pages so only logged-in users can see them",
                  "Show the logged-in user's name and photo in the topbar",
                  "Lock the /api routes so only authenticated users can call them",
                ].map((prompt) => (
                  <span
                    key={prompt}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-600 font-medium"
                  >
                    <Sparkles className="h-3 w-3 shrink-0" />
                    {prompt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placeholder data — replace with your real metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {healthLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <Badge
              variant={healthData?.status === "ok" ? "default" : "destructive"}
              className="gap-1.5"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  healthData?.status === "ok" ? "bg-green-400" : "bg-red-400"
                }`}
              />
              API {healthData?.status === "ok" ? "online" : "offline"}
            </Badge>
          )}
          <Button size="sm" className="gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5" />
            New report
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total revenue"  value="$48,295" change="+12.5%" positive    icon={DollarSign}  description="vs last month" />
        <StatCard title="Active users"   value="3,842"   change="+8.2%"  positive    icon={Users}       description="vs last month" />
        <StatCard title="Total orders"   value="1,294"   change="-3.1%"  positive={false} icon={ShoppingCart} description="vs last month" />
        <StatCard title="Uptime"         value="99.98%"  change="+0.02%" positive    icon={Activity}    description="last 30 days" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue area chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue over time</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: chartTextColor,
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <CardDescription>Requests per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: chartTextColor,
                  }}
                  formatter={(v: number) => [v, "Requests"]}
                />
                <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: activity + goals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent activity */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest actions across your workspace</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-500 text-xs">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentActivity.map((item, idx) => {
              const badge = activityBadge[item.type as ActivityType]
              return (
                <div key={item.id}>
                  <div className="flex items-center gap-3 py-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-blue-500/10 text-blue-500 text-xs font-semibold">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.user}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.action}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">{item.time}</span>
                    </div>
                  </div>
                  {idx < recentActivity.length - 1 && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly goals</CardTitle>
            <CardDescription>Progress toward this month's targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {goals.map((goal) => {
              const pct = Math.round((goal.current / goal.target) * 100)
              return (
                <div key={goal.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{goal.label}</span>
                    <span className="text-muted-foreground text-xs">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.current.toLocaleString()}</span>
                    <span>{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
