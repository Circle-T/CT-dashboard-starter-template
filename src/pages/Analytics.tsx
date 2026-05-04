import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const lineData = [
  { month: "Jan", sessions: 1200, pageviews: 4800 },
  { month: "Feb", sessions: 1900, pageviews: 7200 },
  { month: "Mar", sessions: 1500, pageviews: 5900 },
  { month: "Apr", sessions: 2400, pageviews: 9100 },
  { month: "May", sessions: 2100, pageviews: 8300 },
  { month: "Jun", sessions: 2800, pageviews: 10500 },
  { month: "Jul", sessions: 3200, pageviews: 12400 },
]

const pieData = [
  { name: "Direct", value: 38 },
  { name: "Organic search", value: 27 },
  { name: "Referral", value: 18 },
  { name: "Social", value: 12 },
  { name: "Email", value: 5 },
]

const COLORS = ["#2563EB", "#0F172A", "#64748B", "#16A34A", "#D97706"]

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <p className="text-sm text-secondary mt-0.5">Traffic and engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sessions &amp; pageviews</CardTitle>
            <CardDescription>Month-over-month comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="sessions" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pageviews" stroke="#0F172A" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: "#64748B" }}>{v}</span>} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
