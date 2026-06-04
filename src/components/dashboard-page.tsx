"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartBar } from "@/components/chart-bar-default"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "@/app/dashboard/data.json"

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

export function DashboardPage({
  user = null,
  agencyOwners = [],
}: {
  user?: UserProp
  agencyOwners?: User[]
}) {
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
              {/* <SectionCards /> */}
              <div className="px-4 lg:px-6">
                <ChartBar />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
