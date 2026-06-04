"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MetricRow } from "@/components/dashboard-page"

export function MrrTable({ metrics = [] }: { metrics?: MetricRow[] }) {
  const sorted = [...metrics].sort((a, b) => b.value - a.value)
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Total MRR ($ USD / month) per agency owner, sorted by value descending. Data is self-reported.</CardDescription>
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
                <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                <TableCell>{medals[index]} {row.name}</TableCell>
                <TableCell>${row.value.toLocaleString("en-US")}</TableCell>
                <TableCell>
                  <a href={row.url} target="_blank" rel="noopener noreferrer">
                    {row.agency}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
