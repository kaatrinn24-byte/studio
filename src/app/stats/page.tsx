'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: 'Week 1', study: 4, focus: 2.5, relax: 1 },
  { month: 'Week 2', study: 3, focus: 2, relax: 3 },
  { month: 'Week 3', study: 5, focus: 3, relax: 1.5 },
  { month: 'Week 4', study: 4.5, focus: 4, relax: 2 },
];

const chartConfig = {
  study: { label: 'Study', color: 'hsl(var(--chart-1))' },
  focus: { label: 'Focus', color: 'hsl(var(--chart-2))' },
  relax: { label: 'Relax', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const totalTime = chartData.reduce((acc, week) => acc + week.study + week.focus + week.relax, 0);

export default function StatsPage() {
  return (
    <div className="flex h-full flex-col">
        <header className="p-6">
            <h1 className="text-3xl font-bold">Your Monthly Wrap</h1>
            <p className="text-muted-foreground">Here's how you spent your time this month.</p>
        </header>
        <div className="flex-1 space-y-6 p-6 pt-0">
            <Card>
                <CardHeader>
                    <CardTitle>Total Time</CardTitle>
                    <CardDescription>Your total time across all modes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{totalTime.toFixed(1)} <span className="text-xl font-normal text-muted-foreground">hours</span></p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Breakdown</CardTitle>
                    <CardDescription>Hours per mode each week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                             <CartesianGrid vertical={false} />
                             <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.replace(" ", "")}
                            />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="study" fill="var(--color-study)" radius={4} />
                            <Bar dataKey="focus" fill="var(--color-focus)" radius={4} />
                            <Bar dataKey="relax" fill="var(--color-relax)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
