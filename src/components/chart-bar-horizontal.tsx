"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import type { MetricRow } from "@/components/dashboard-page";

const chartConfig = {
	value: {
		label: "MRR (USD)",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

function CustomYAxisTick({
	x,
	y,
	payload,
	data,
}: {
	x: number;
	y: number;
	payload: { value: string };
	data: MetricRow[];
}) {
	const entry = data.find((d) => d.name === payload.value);
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={-10}
				y={0}
				dy={-4}
				textAnchor="end"
				fontSize={12}
				fill="currentColor"
			>
				{payload.value}
			</text>
			{entry?.agency && (
				<text
					x={-10}
					y={0}
					dy={10}
					textAnchor="end"
					fontSize={10}
					fill="gray"
				>
					{entry.agency}
				</text>
			)}
		</g>
	);
}

function measureText(text: string, fontSize: number): number {
	if (typeof document === "undefined") return 120;
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) return 120;
	ctx.font = `${fontSize}px sans-serif`;
	return ctx.measureText(text).width;
}

export function ChartBarMobile({ metrics = [] }: { metrics?: MetricRow[] }) {
	const yAxisWidth = React.useMemo(() => {
		if (metrics.length === 0) return 120;
		const widest = Math.max(
			...metrics.map((m) =>
				Math.max(
					measureText(m.name, 12),
					measureText(m.agency ?? "", 10),
				)
			)
		);
		return Math.ceil(widest) + 16;
	}, [metrics]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Bar Chart</CardTitle>
				<CardDescription>
					Total MRR ($ USD / month) per agency owner. Data is public
					and self-reported.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="max-h-96 w-full"
				>
					<BarChart
						layout="vertical"
						data={metrics}
					>
						<XAxis type="number" dataKey="value" hide />
						<YAxis
							type="category"
							dataKey="name"
							tickLine={false}
							axisLine={false}
							tickMargin={10}
							width={yAxisWidth}
							tick={(props) => (
								<CustomYAxisTick {...props} data={metrics} />
							)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="value"
							fill="var(--color-value)"
							radius={5}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
