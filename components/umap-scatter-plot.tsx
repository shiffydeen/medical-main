"use client"

import { useMemo } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface UMAPScatterPlotProps {
  selectedGene: string
  expressionRange: number[]
  hoveredPatient: string | null
  onCellClick: (patientId: string) => void
}

// Mock UMAP data with cell coordinates and patient assignments
const generateUMAPData = (gene: string, expressionRange: number[]) => {
  const patients = ["P001", "P002", "P003", "P004", "P005", "P006", "P007", "P008", "P009", "P010"]
  const outcomes = {
    P001: "durable",
    P002: "early-relapse",
    P003: "durable",
    P004: "early-relapse",
    P005: "durable",
    P006: "early-relapse",
    P007: "durable",
    P008: "early-relapse",
    P009: "durable",
    P010: "early-relapse",
  }

  const data = []

  // Generate cells for each patient
  patients.forEach((patientId, patientIndex) => {
    const cellCount = Math.floor(Math.random() * 50) + 20 // 20-70 cells per patient
    const baseX = (patientIndex % 5) * 4 + Math.random() * 2 - 1
    const baseY = Math.floor(patientIndex / 5) * 4 + Math.random() * 2 - 1

    for (let i = 0; i < cellCount; i++) {
      const expression = Math.random() * 100

      // Filter by expression range
      if (expression >= expressionRange[0] && expression <= expressionRange[1]) {
        data.push({
          x: baseX + (Math.random() - 0.5) * 3,
          y: baseY + (Math.random() - 0.5) * 3,
          expression,
          patientId,
          outcome: outcomes[patientId as keyof typeof outcomes],
          cellId: `${patientId}_cell_${i}`,
        })
      }
    }
  })

  return data
}

const getExpressionColor = (expression: number) => {
  // Color scale from low (blue) to high (red) expression
  const ratio = expression / 100
  const r = Math.floor(255 * ratio)
  const b = Math.floor(255 * (1 - ratio))
  return `rgb(${r}, 100, ${b})`
}

export function UMAPScatterPlot({ selectedGene, expressionRange, hoveredPatient, onCellClick }: UMAPScatterPlotProps) {
  const data = useMemo(() => generateUMAPData(selectedGene, expressionRange), [selectedGene, expressionRange])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Cell: {data.cellId}</p>
          <p className="text-sm">Patient: {data.patientId}</p>
          <p className="text-sm">Outcome: {data.outcome}</p>
          <p className="text-sm">
            {selectedGene} Expression: {data.expression.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-2, 12]}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[-2, 10]}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} onClick={(data) => onCellClick(data.patientId)} style={{ cursor: "pointer" }}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getExpressionColor(entry.expression)}
                stroke={hoveredPatient === entry.patientId ? "hsl(var(--primary))" : "none"}
                strokeWidth={hoveredPatient === entry.patientId ? 2 : 0}
                opacity={hoveredPatient && hoveredPatient !== entry.patientId ? 0.3 : 0.8}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Expression Legend */}
      <div className="flex items-center justify-center mt-4 space-x-4">
        <span className="text-sm text-muted-foreground">Low Expression</span>
        <div className="flex space-x-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: getExpressionColor(i * 10) }} />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">High Expression</span>
      </div>
    </div>
  )
}
