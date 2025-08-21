"use client"

import { useMemo } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ExpressionViolinProps {
  selectedGene: string
  selectedTissue: string
  selectedDataset: string
}

// Mock detailed expression distribution data
const generateViolinData = (gene: string, tissue: string, dataset: string) => {
  const tissues = tissue === "all" ? ["Tumor", "Blood", "Lymph Node", "Bone Marrow"] : [tissue]

  // Base expression patterns for different genes and tissues
  const genePatterns = {
    CD8A: { tumor: { mean: 75, std: 15 }, blood: { mean: 45, std: 12 }, lymphNode: { mean: 85, std: 10 } },
    PDCD1: { tumor: { mean: 65, std: 18 }, blood: { mean: 30, std: 8 }, lymphNode: { mean: 70, std: 12 } },
    LAG3: { tumor: { mean: 55, std: 20 }, blood: { mean: 25, std: 6 }, lymphNode: { mean: 60, std: 15 } },
    HAVCR2: { tumor: { mean: 70, std: 16 }, blood: { mean: 40, std: 10 }, lymphNode: { mean: 65, std: 14 } },
    TIGIT: { tumor: { mean: 60, std: 14 }, blood: { mean: 35, std: 9 }, lymphNode: { mean: 55, std: 11 } },
    CTLA4: { tumor: { mean: 50, std: 22 }, blood: { mean: 20, std: 5 }, lymphNode: { mean: 45, std: 18 } },
  }

  const data: any[] = []

  tissues.forEach((tissueType) => {
    const pattern = genePatterns[gene as keyof typeof genePatterns]?.tumor || { mean: 50, std: 15 }

    // Generate sample points for violin plot
    const sampleCount = 50
    for (let i = 0; i < sampleCount; i++) {
      // Generate normal distribution around mean
      const u1 = Math.random()
      const u2 = Math.random()
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
      const expression = Math.min(100, Math.max(0, pattern.mean + z0 * pattern.std))

      data.push({
        tissue: tissueType,
        expression,
        sampleId: `${tissueType}_${i}`,
        x: tissueType,
        y: expression,
      })
    }
  })

  return data
}

// Calculate violin plot statistics
const calculateStats = (data: any[], tissue: string) => {
  const tissueData = data.filter((d) => d.tissue === tissue).map((d) => d.expression)
  tissueData.sort((a, b) => a - b)

  const mean = tissueData.reduce((sum, val) => sum + val, 0) / tissueData.length
  const median = tissueData[Math.floor(tissueData.length / 2)]
  const q1 = tissueData[Math.floor(tissueData.length * 0.25)]
  const q3 = tissueData[Math.floor(tissueData.length * 0.75)]
  const min = tissueData[0]
  const max = tissueData[tissueData.length - 1]

  return { mean, median, q1, q3, min, max, count: tissueData.length }
}

export function ExpressionViolin({ selectedGene, selectedTissue, selectedDataset }: ExpressionViolinProps) {
  const data = useMemo(
    () => generateViolinData(selectedGene, selectedTissue, selectedDataset),
    [selectedGene, selectedTissue, selectedDataset],
  )

  const tissues = [...new Set(data.map((d) => d.tissue))]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Sample: {data.sampleId}</p>
          <p className="text-sm">Tissue: {data.tissue}</p>
          <p className="text-sm">
            {selectedGene} Expression: {data.expression.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Violin Plot (represented as scatter with jitter) */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="category"
              dataKey="tissue"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              type="number"
              dataKey="expression"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              label={{ value: "Expression (%)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.tissue === "Tumor"
                      ? "hsl(var(--chart-1))"
                      : entry.tissue === "Blood"
                        ? "hsl(var(--chart-2))"
                        : entry.tissue === "Lymph Node"
                          ? "hsl(var(--chart-3))"
                          : "hsl(var(--chart-4))"
                  }
                  opacity={0.6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Statistical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tissues.map((tissue) => {
          const stats = calculateStats(data, tissue)
          return (
            <div key={tissue} className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-medium mb-3">{tissue}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mean:</span>
                  <span className="font-medium">{stats.mean.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Median:</span>
                  <span className="font-medium">{stats.median.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Q1-Q3:</span>
                  <span className="font-medium">
                    {stats.q1.toFixed(1)}-{stats.q3.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Range:</span>
                  <span className="font-medium">
                    {stats.min.toFixed(1)}-{stats.max.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Samples:</span>
                  <span className="font-medium">{stats.count}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expression Distribution Comparison */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium mb-3">Expression Distribution Analysis</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>{selectedGene}</strong> shows tissue-specific expression patterns across the selected dataset.
          </p>
          {tissues.length > 1 && (
            <p>
              Highest expression observed in{" "}
              <strong>
                {tissues.reduce((max, tissue) => {
                  const maxStats = calculateStats(data, max)
                  const tissueStats = calculateStats(data, tissue)
                  return tissueStats.mean > maxStats.mean ? tissue : max
                })}
              </strong>
              , with significant variation between tissue types indicating functional specialization.
            </p>
          )}
          <p>
            The distribution patterns suggest {selectedGene} plays a critical role in tissue-specific immune responses
            and could serve as a biomarker for treatment stratification.
          </p>
        </div>
      </div>
    </div>
  )
}
