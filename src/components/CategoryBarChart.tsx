"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Text, XAxis, YAxis } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

function useMobile() {
    const [isMobile, setIsMobile] = useState(() =>
        !window.matchMedia("(min-width: 640px)").matches
    )

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 640px)")
        const updateMobile = (e: MediaQueryListEvent) => {
            const isMobileView = !e.matches
            setIsMobile(isMobileView)
        }
        mediaQuery.addEventListener("change", updateMobile)
        return () => mediaQuery.removeEventListener("change", updateMobile)
    }, [])

    return isMobile
}

function WrappedYAxisTick({ x = 0, y = 0, payload, maxWidth }: { x?: number; y?: number; payload?: { value?: string }; maxWidth: number }) {
    const value = payload?.value ?? ""
    if (!value) return null
    return (
        <Text
            x={x}
            y={y}
            width={maxWidth}
            textAnchor="end"
            verticalAnchor="middle"
            style={{ fontSize: 12, lineHeight: 1.2 }}
        >
            {value}
        </Text>
    )
}

export function CategoryBarChart({ 
    data, 
    onCategoryClick 
}: { 
    data: Array<{ key: string; count: number }>
    onCategoryClick?: (categoryName: string) => void
}) {
    const isMobile = useMobile()
    const yAxisWidth = isMobile ? 120 : 190

    const config = data.reduce<ChartConfig>((acc, item) => {
        acc[item.key] = { label: item.key }
        return acc
    }, {})

    const handleBarClick = (data: { key: string } | undefined) => {
        if (data?.key && onCategoryClick) {
            onCategoryClick(data.key)
        }
    }

    return (
        <ChartContainer
            config={config}
            style={{ "--bar-count": data.length } as React.CSSProperties}
            className="!aspect-auto
             h-[calc(var(--bar-count)*var(--bar-size)+30px)]
             [--bar-size:45px]
             sm:[--bar-size:35px]
             "
        >
            <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{ left:0 }}
            >
                <XAxis
                    type="number"
                    dataKey="count"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                    domain={isMobile ? [0, Math.max(...data.map(item => item.count), 0)] : undefined}
                />
                <YAxis
                    dataKey="key"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={(props) => <WrappedYAxisTick {...props} maxWidth={yAxisWidth} />}
                    width={yAxisWidth}
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
                <Bar 
                    dataKey="count" 
                    fill="var(--chart-1)" 
                    radius={5}
                    onClick={handleBarClick}
                    style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
                >
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}

