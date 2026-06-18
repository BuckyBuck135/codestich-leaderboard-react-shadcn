"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartBar } from "@/components/chart-bar-default"
import { MrrTable } from "@/components/mrr-table"
import { ChartLineLinear } from "@/components/chart-line-linear"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export type UserProp = {
  id: string
  name: string
  email: string
  avatar: string
  accountType: "admin" | "agency owner" | null
  agency: string | null
  account_type?: string | null
  url?: string | null
} | null

export type User = { id: string; name: string; agency: string }

export type MetricRow = {
  name: string
  value: number
  agency: string
  url: string
}

export type MrrHistoryEntry = {
  value: number
  recorded_at: string
}

export function DashboardPage({
  user = null,
  agencyOwners = [],
  metrics: initialMetrics = [],
}: {
  user?: UserProp
  agencyOwners?: User[]
  metrics?: MetricRow[]
}) {
  const [metrics, setMetrics] = React.useState<MetricRow[]>(initialMetrics)
  const [mrrHistory, setMrrHistory] = React.useState<MrrHistoryEntry[]>([])

  React.useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    async function fetchHistory() {
      if (!user?.id) return
      const { data } = await supabase
        .from("mrr_history")
        .select("value, recorded_at")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: true })
      if (data) setMrrHistory(data)
    }

    async function fetchMetrics() {
      const { data } = await supabase.from("mrr").select(`
        value,
        user_profiles!inner(name, agency, url)
      `)
      if (data) {
        setMetrics(
          (data as any[]).map((row) => ({
            name: row.user_profiles.name,
            agency: row.user_profiles.agency,
            url: row.user_profiles.url,
            value: row.value,
          }))
        )
      }
    }

    fetchHistory()
    fetchMetrics()

    const channel = supabase
      .channel("mrr-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mrr" },
        () => {
          fetchMetrics()
          fetchHistory()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} agencyOwners={agencyOwners} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ChartBar metrics={metrics} />
              </div>
              <div className="px-4 lg:px-6">
                <MrrTable metrics={metrics} />
              </div>
              <div className="px-4 lg:px-6">
                <ChartLineLinear
                  data={mrrHistory}
                  isAuthenticated={!!user?.id}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
