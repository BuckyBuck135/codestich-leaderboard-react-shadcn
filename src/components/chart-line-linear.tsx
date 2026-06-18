"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type MrrHistoryEntry = { value: number; recorded_at: string }

const chartConfig = {
  mrr: {
    label: "MRR ($)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineLinear({
  data = [],
  isAuthenticated = true,
}: {
  data?: MrrHistoryEntry[]
  isAuthenticated?: boolean
}) {
  const chartData = data.map((entry) => ({
    date: new Date(entry.recorded_at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    mrr: entry.value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>MRR Over Time</CardTitle>
        <CardDescription>Your total MRR ($ USD / month) over time.</CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
        <ChartContainer config={chartConfig} className="max-h-96 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="mrr"
              type="linear"
              stroke="var(--color-mrr)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        ) : (
          <div className="flex max-h-96 min-h-[200px] items-center justify-center text-sm text-muted-foreground">
            <p className="text-center">
              <a href="/auth/signin" className="underline">Sign in</a> to track your MRR over time.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          All-time MRR submissions
        </div>
      </CardFooter>
    </Card>
  )
}
