"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface GeneExpressionTimelineProps {
  patientId: string
  selectedTimepoint: string
}

// Mock longitudinal gene expression data
const generateTimelineData = (patientId: string) => {
  const timepoints = [
    { name: "Baseline", day: 0, label: "baseline" },
    { name: "Week 2", day: 14, label: "week2" },
    { name: "Week 4", day: 28, label: "week4" },
    { name: "Week 8", day: 56, label: "week8" },
    { name: "Week 12", day: 84, label: "week12" },
  ]

  // Different expression patterns based on patient outcome
  const patientOutcomes = {
    P001: "durable",
    P003: "durable",
    P005: "durable",
    P007: "durable",
    P009: "durable",
    P002: "early-relapse",
    P004: "early-relapse",
    P006: "early-relapse",
    P008: "early-relapse",
    P010: "early-relapse",
  }

  const outcome = patientOutcomes[patientId as keyof typeof patientOutcomes] || "durable"

  return timepoints.map((tp, index) => {
    // Simulate different gene expression patterns
    let cd8a, pdcd1, lag3, havcr2, tigit

    if (outcome === "durable") {
      // Durable responders: CD8A increases, exhaustion markers decrease over time
      cd8a = 40 + index * 8 + Math.random() * 10
      pdcd1 = 60 - index * 5 + Math.random() * 8
      lag3 = 45 - index * 4 + Math.random() * 6
      havcr2 = 50 - index * 6 + Math.random() * 7
      tigit = 55 - index * 3 + Math.random() * 5
    } else {
      // Early relapse: CD8A decreases, exhaustion markers increase
      cd8a = 60 - index * 6 + Math.random() * 8
      pdcd1 = 40 + index * 7 + Math.random() * 10
      lag3 = 35 + index * 5 + Math.random() * 8
      havcr2 = 30 + index * 8 + Math.random() * 9
      tigit = 45 + index * 4 + Math.random() * 6
    }

    return {
      ...tp,
      CD8A: Math.max(0, Math.min(100, cd8a)),
      PDCD1: Math.max(0, Math.min(100, pdcd1)),
      LAG3: Math.max(0, Math.min(100, lag3)),
      HAVCR2: Math.max(0, Math.min(100, havcr2)),
      TIGIT: Math.max(0, Math.min(100, tigit)),
    }
  })
}

export function GeneExpressionTimeline({ patientId, selectedTimepoint }: GeneExpressionTimelineProps) {
  const data = useMemo(() => generateTimelineData(patientId), [patientId])

  const selectedDay = data.find((d) => d.label === selectedTimepoint)?.day || 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Line Chart for Gene Expression */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              label={{ value: "Expression (%)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference line for selected timepoint */}
            <ReferenceLine
              x={data.find((d) => d.label === selectedTimepoint)?.name}
              stroke="hsl(var(--primary))"
              strokeDasharray="5 5"
              strokeWidth={2}
            />

            {/* Gene expression lines */}
            <Line
              type="monotone"
              dataKey="CD8A"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="PDCD1"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="LAG3"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="HAVCR2"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="TIGIT"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gene Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { gene: "CD8A", color: "hsl(var(--chart-1))", description: "T-cell activation" },
          { gene: "PDCD1", color: "hsl(var(--chart-2))", description: "PD-1 checkpoint" },
          { gene: "LAG3", color: "hsl(var(--chart-3))", description: "LAG-3 checkpoint" },
          { gene: "HAVCR2", color: "hsl(var(--chart-4))", description: "TIM-3 checkpoint" },
          { gene: "TIGIT", color: "hsl(var(--chart-5))", description: "TIGIT checkpoint" },
        ].map(({ gene, color, description }) => (
          <div key={gene} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium">{gene}</span>
            <span className="text-xs text-muted-foreground">({description})</span>
          </div>
        ))}
      </div>

      {/* Current Timepoint Values */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {data.find((d) => d.label === selectedTimepoint) &&
          Object.entries(data.find((d) => d.label === selectedTimepoint)!).map(([key, value]) => {
            if (!["CD8A", "PDCD1", "LAG3", "HAVCR2", "TIGIT"].includes(key)) return null
            return (
              <div key={key} className="bg-muted rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">{key}</p>
                <p className="text-lg font-bold">{(value as number).toFixed(1)}%</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}
