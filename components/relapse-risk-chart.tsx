"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface RelapseRiskChartProps {
  patientId: string
  selectedTimepoint: string
}

// Mock relapse risk prediction data
const generateRiskData = (patientId: string) => {
  const timepoints = [
    { name: "Baseline", day: 0, label: "baseline" },
    { name: "Week 2", day: 14, label: "week2" },
    { name: "Week 4", day: 28, label: "week4" },
    { name: "Week 8", day: 56, label: "week8" },
    { name: "Week 12", day: 84, label: "week12" },
  ]

  // Different risk patterns based on patient outcome
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
    let lowRisk, mediumRisk, highRisk

    if (outcome === "durable") {
      // Durable responders: decreasing risk over time
      lowRisk = 30 + index * 15 + Math.random() * 10
      mediumRisk = 50 - index * 8 + Math.random() * 8
      highRisk = 20 - index * 7 + Math.random() * 5
    } else {
      // Early relapse: increasing risk over time
      lowRisk = 60 - index * 12 + Math.random() * 8
      mediumRisk = 25 + index * 5 + Math.random() * 6
      highRisk = 15 + index * 10 + Math.random() * 8
    }

    // Normalize to 100%
    const total = lowRisk + mediumRisk + highRisk
    lowRisk = (lowRisk / total) * 100
    mediumRisk = (mediumRisk / total) * 100
    highRisk = (highRisk / total) * 100

    // Calculate overall risk score
    const riskScore = lowRisk * 0.1 + mediumRisk * 0.5 + highRisk * 0.9

    return {
      ...tp,
      lowRisk: Math.max(0, lowRisk),
      mediumRisk: Math.max(0, mediumRisk),
      highRisk: Math.max(0, highRisk),
      riskScore: Math.min(100, Math.max(0, riskScore)),
    }
  })
}

export function RelapseRiskChart({ patientId, selectedTimepoint }: RelapseRiskChartProps) {
  const data = useMemo(() => generateRiskData(patientId), [patientId])

  const selectedData = data.find((d) => d.label === selectedTimepoint)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Overall Risk Score: {data.riskScore.toFixed(1)}%</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm" style={{ color: "hsl(var(--chart-1))" }}>
              Low Risk: {data.lowRisk.toFixed(1)}%
            </p>
            <p className="text-sm" style={{ color: "hsl(var(--chart-3))" }}>
              Medium Risk: {data.mediumRisk.toFixed(1)}%
            </p>
            <p className="text-sm" style={{ color: "hsl(var(--destructive))" }}>
              High Risk: {data.highRisk.toFixed(1)}%
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return "hsl(var(--chart-1))" // Green for low risk
    if (riskScore < 70) return "hsl(var(--chart-3))" // Yellow for medium risk
    return "hsl(var(--destructive))" // Red for high risk
  }

  return (
    <div className="space-y-4">
      {/* Risk Score Over Time */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              label={{ value: "Risk Score (%)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="riskScore" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getRiskColor(entry.riskScore)}
                  stroke={entry.label === selectedTimepoint ? "hsl(var(--primary))" : "none"}
                  strokeWidth={entry.label === selectedTimepoint ? 3 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Current Risk Breakdown */}
      {selectedData && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold">
              Risk Assessment at {data.find((d) => d.label === selectedTimepoint)?.name}
            </h4>
            <div className="text-3xl font-bold mt-2" style={{ color: getRiskColor(selectedData.riskScore) }}>
              {selectedData.riskScore.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Overall Relapse Risk</p>
          </div>

          {/* Risk Category Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
              <p className="text-sm font-medium">Low Risk</p>
              <p className="text-lg font-bold">{selectedData.lowRisk.toFixed(1)}%</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
              <p className="text-sm font-medium">Medium Risk</p>
              <p className="text-lg font-bold">{selectedData.mediumRisk.toFixed(1)}%</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: "hsl(var(--destructive))" }}
              />
              <p className="text-sm font-medium">High Risk</p>
              <p className="text-lg font-bold">{selectedData.highRisk.toFixed(1)}%</p>
            </div>
          </div>

          {/* Risk Interpretation */}
          <div className="bg-muted rounded-lg p-4">
            <h5 className="font-medium mb-2">Clinical Interpretation</h5>
            <p className="text-sm text-muted-foreground">
              {selectedData.riskScore < 30
                ? "Low relapse risk. Patient shows favorable response patterns with strong immune activation markers."
                : selectedData.riskScore < 70
                  ? "Moderate relapse risk. Monitor closely for changes in biomarker expression and clinical response."
                  : "High relapse risk. Consider alternative treatment strategies or intensified monitoring protocols."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
