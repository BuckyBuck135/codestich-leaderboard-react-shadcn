import * as React from "react"
import { actions } from "astro:actions"

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
} from "@/components/ui/sidebar"
import { IconInnerShadowTop } from "@tabler/icons-react"
import type { UserProp, User } from "@/components/dashboard-page"

function SubmitScoreForm({
  user,
  agencyOwners,
}: {
  user: UserProp
  agencyOwners: User[]
}) {
  const [targetUserId, setTargetUserId] = React.useState("")
  const [value, setValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const isGuest = !user
  const isAdmin = user?.accountType === "admin"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)

    const { error } = await actions.submitMrr(
      isAdmin
        ? { targetUserId, value: Number(value) }
        : { value: Number(value) }
    )

    setIsLoading(false)
    if (error) {
      setFeedback({ type: "error", message: error.message })
    } else {
      setFeedback({ type: "success", message: "MRR submitted" })
      setValue("")
      if (isAdmin) setTargetUserId("")
    }
  }

  const canSubmit =
    value !== "" && (user?.accountType === "agency owner" || (isAdmin && targetUserId !== ""))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="agency">Agency</Label>
        {isAdmin ? (
          <Select value={targetUserId} onValueChange={(val) => setTargetUserId(val ?? "")}>
            <SelectTrigger id="agency" className="w-full rounded-md">
              <SelectValue placeholder="Select agency">
                {agencyOwners.find(o => o.id === targetUserId)?.agency ??
                  agencyOwners.find(o => o.id === targetUserId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {agencyOwners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.agency ?? owner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="agency"
            value={isGuest ? "" : (user?.agency ?? "")}
            readOnly
            disabled={isGuest}
            placeholder={isGuest ? "—" : undefined}
            className="bg-muted"
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="score-value">Value (USD/mo)</Label>
        <Input
          id="score-value"
          type="number"
          min={0}
          placeholder="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isGuest}
        />
      </div>
      {isGuest ? (
        <p className="text-s text-muted-foreground text-center">
          <a href="/auth/signin" className="underline">
            Sign in
          </a>{" "}
          to submit MRR
        </p>
      ) : (
        <Button type="submit" className="w-full" disabled={!canSubmit || isLoading}>
          {isLoading ? "Submitting…" : "Submit"}
        </Button>
      )}
      {feedback && (
        <p
          className={`text-xs ${
            feedback.type === "success" ? "text-green-600" : "text-destructive"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </form>
  )
}

export function AppSidebar({
  user = null,
  agencyOwners = [],
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: UserProp
  agencyOwners?: User[]
}) {
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
        <SidebarGroup>
          <SidebarGroupLabel>Add or Update MRR</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SubmitScoreForm user={user} agencyOwners={agencyOwners} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
