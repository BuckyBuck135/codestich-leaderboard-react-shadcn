"use client"

// import { IconTrendingUp } from "@tabler/icons-react"
import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts"

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
import type { MetricRow } from "@/components/dashboard-page"

const chartConfig = {
  value: {
    label: "MRR (USD)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function CustomXAxisTick({
  x, y, payload, data,
}: {
  x: number | string; y: number | string; payload: { value: string }; data: MetricRow[]
}) {
  const entry = data.find((d) => d.name === payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fontSize={12} fill="currentColor">
        {payload.value}
      </text>
      {entry?.agency && (
        <text x={0} y={0} dy={30} textAnchor="middle" fontSize={10} fill="gray">
          {entry.agency}
        </text>
      )}
    </g>
  )
}

export function ChartBar({ metrics = [] }: { metrics?: MetricRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>Total MRR ($ USD / month) per agency owner. Data is self-reported.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-96">
          <BarChart accessibilityLayer data={metrics} margin={{ bottom: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tick={(props) => <CustomXAxisTick {...props} data={metrics} />}
            />
			<YAxis 
			dataKey="value" 
			tickLine={false}
            tickMargin={10}
            axisLine={false}/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Agency owners using the Codestitch business model and/or the Codestitch UI library. 
        </div>
        <div className="leading-none text-muted-foreground">
          Sign up to add your 🏆 #freelancing-wins!
        </div>
      </CardFooter> */}
    </Card>
  )
}
