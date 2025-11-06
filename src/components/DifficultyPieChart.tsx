"use client"

import { LabelList, Pie, PieChart } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export function DifficultyPieChart({ data }: { data: Array<{ key: string; count: number }> }) {
    const config: ChartConfig = {
        easy: {
            label: 'Easy',
            color: 'var(--chart-easy)',
        },
        medium: {
            label: 'Medium',
            color: 'var(--chart-medium)',
        },
        hard: {
            label: 'Hard',
            color: 'var(--chart-hard)',
        },
    }

    const chartData = data.map(item => ({
        ...item,
        fill: `var(--color-${item.key.toLowerCase()})`,
    }))

    return (
        <ChartContainer
            config={config}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={chartData} dataKey="count" nameKey="key">
                    <LabelList
                        dataKey="key"
                        className="fill-background"
                        stroke="none"
                        fontSize={12}
                        formatter={(value: keyof typeof config) =>
                            config[value]?.label
                        }
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}

