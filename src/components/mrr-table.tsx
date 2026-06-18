"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { MetricRow } from "@/components/dashboard-page";

const medals = ["🥇", "🥈", "🥉"];

export function MrrTable({ metrics = [] }: { metrics?: MetricRow[] }) {
	const sorted = [...metrics].sort((a, b) => b.value - a.value);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Leaderboard</CardTitle>
				<CardDescription>
					Total MRR ($ USD / month) per agency owner, sorted by value
					descending. Data is public and self-reported.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>MRR ($ USD/month)</TableHead>
							<TableHead>Agency</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sorted.map((row, index) => (
							<TableRow key={row.name}>
								<TableCell>
									{String(index + 1).padStart(2, "0")}
								</TableCell>
								<TableCell>
									{medals[index]} {row.name}
								</TableCell>
								<TableCell>
									${row.value.toLocaleString("en-US")}
								</TableCell>
								<TableCell>
									<a
										href={row.url}
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										{row.agency}
									</a>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
