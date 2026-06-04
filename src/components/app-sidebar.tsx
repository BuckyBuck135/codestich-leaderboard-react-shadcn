import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconCamera,
  IconFileDescription,
  IconFileAi,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconInnerShadowTop,
} from "@tabler/icons-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <IconDashboard />,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: <IconListDetails />,
    },
    {
      title: "Analytics",
      url: "#",
      icon: <IconChartBar />,
    },
    {
      title: "Projects",
      url: "#",
      icon: <IconFolder />,
    },
    {
      title: "Team",
      url: "#",
      icon: <IconUsers />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <IconCamera />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <IconFileDescription />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <IconFileAi />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <IconHelp />,
    },
    {
      title: "Search",
      url: "#",
      icon: <IconSearch />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <IconDatabase />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <IconReport />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <IconFileWord />,
    },
  ],
}
function SubmitScoreForm() {
  const [agency, setAgency] = React.useState("")
  const [value, setValue] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire to action
    console.log({ agency, value })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="agency">Agency</Label>
        <Select value={agency} onValueChange={(val) => setAgency(val ?? "")}>
          <SelectTrigger id="agency" className="w-full rounded-md">
            <SelectValue placeholder="Select agency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agency-a">Agency A</SelectItem>
            <SelectItem value="agency-b">Agency B</SelectItem>
            <SelectItem value="agency-c">Agency C</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="score-value">Value</Label>
        <Input
          id="score-value"
          type="number"
          min={0}
          placeholder="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={!agency || !value}>
        Submit
      </Button>
    </form>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <IconInnerShadowTop className="size-5!" />
              <span className="text-base font-semibold">Acme Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <SidebarSeparator /> */}
        <SidebarGroup>
          <SidebarGroupLabel>Add or Update MRR</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SubmitScoreForm />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
