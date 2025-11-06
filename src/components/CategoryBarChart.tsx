"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export function CategoryBarChart({ data }: { data: Array<{ key: string; count: number }> }) {
    const config: ChartConfig = {
        ...Object.fromEntries(
            data.map((item) => [
                item.key,
                {
                    label: item.key,
                },
            ])
        ),
    }
    return (
        <ChartContainer config={config}>
            <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"

                margin={{
                    left: -20,
                }}
            >
                <XAxis
                    type="number"
                    dataKey="count"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                    dataKey="key"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <CartesianGrid horizontal={false} />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            nameKey="key"
                        />
                    }
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={5} />
            </BarChart>
        </ChartContainer>
    )
}

