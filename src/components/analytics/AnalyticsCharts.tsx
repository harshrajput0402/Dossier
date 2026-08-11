// Destination: src/components/analytics/AnalyticsCharts.tsx
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StatusSlice {
  status: string;
  count: number;
  color: string;
}
interface WeekPoint {
  week: string;
  count: number;
}

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  fontSize: 12,
};

export function AnalyticsCharts({
  total,
  responseRate,
  avgMatchScore,
  avgResponseDays,
  statusBreakdown,
  weeklyApplications,
}: {
  total: number;
  responseRate: number;
  avgMatchScore: number | null;
  avgResponseDays: number | null;
  statusBreakdown: StatusSlice[];
  weeklyApplications: WeekPoint[];
}) {
  const hasData = total > 0;

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Applications" value={String(total)} />
        <StatCard label="Response Rate" value={`${responseRate}%`} />
        <StatCard
          label="Avg Match Score"
          value={avgMatchScore !== null ? `${avgMatchScore}%` : "—"}
        />
        <StatCard
          label="Avg Response Time"
          value={avgResponseDays !== null ? `${avgResponseDays}d` : "—"}
        />
      </div>

      {!hasData ? (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-text-soft">
          Add a few applications and your charts will show up here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-surface p-5">
            <div className="mb-4 font-mono text-xs uppercase tracking-wide text-text-soft">
              Applications per week
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "var(--text-soft)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--text-soft)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                  width={24}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <div className="mb-4 font-mono text-xs uppercase tracking-wide text-text-soft">
              Status breakdown
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {statusBreakdown.map((s) => (
                    <Cell key={s.status} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "var(--text-soft)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-text-soft">
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}