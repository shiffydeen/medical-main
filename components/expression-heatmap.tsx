"use client"

import { useMemo } from "react"

interface ExpressionHeatmapProps {
  selectedGene: string
  selectedTissue: string
  selectedDataset: string
}

// Mock expression data across tissues and datasets
const generateHeatmapData = (gene: string, tissue: string, dataset: string) => {
  const tissues = ["Tumor", "Blood", "Lymph Node", "Bone Marrow", "Normal Tissue"]
  const datasets = ["Primary Cohort", "Validation Cohort", "TCGA Reference", "GTEx Reference"]
  const genes = ["CD8A", "PDCD1", "LAG3", "HAVCR2", "TIGIT", "CTLA4"]

  // Base expression patterns for different genes
  const genePatterns = {
    CD8A: { tumor: 75, blood: 45, lymphNode: 85, boneMarrow: 35, normal: 25 },
    PDCD1: { tumor: 65, blood: 30, lymphNode: 70, boneMarrow: 20, normal: 15 },
    LAG3: { tumor: 55, blood: 25, lymphNode: 60, boneMarrow: 15, normal: 10 },
    HAVCR2: { tumor: 70, blood: 40, lymphNode: 65, boneMarrow: 25, normal: 20 },
    TIGIT: { tumor: 60, blood: 35, lymphNode: 55, boneMarrow: 20, normal: 15 },
    CTLA4: { tumor: 50, blood: 20, lymphNode: 45, boneMarrow: 15, normal: 10 },
  }

  const data = []

  // Generate data for each tissue-dataset combination
  tissues.forEach((tissueType) => {
    datasets.forEach((datasetType) => {
      const basePattern = genePatterns[gene as keyof typeof genePatterns] || genePatterns.CD8A
      let baseExpression = 50

      // Get base expression for tissue
      switch (tissueType) {
        case "Tumor":
          baseExpression = basePattern.tumor
          break
        case "Blood":
          baseExpression = basePattern.blood
          break
        case "Lymph Node":
          baseExpression = basePattern.lymphNode
          break
        case "Bone Marrow":
          baseExpression = basePattern.boneMarrow
          break
        case "Normal Tissue":
          baseExpression = basePattern.normal
          break
      }

      // Adjust for dataset type
      let datasetMultiplier = 1
      switch (datasetType) {
        case "Primary Cohort":
          datasetMultiplier = 1.0
          break
        case "Validation Cohort":
          datasetMultiplier = 0.9
          break
        case "TCGA Reference":
          datasetMultiplier = 1.1
          break
        case "GTEx Reference":
          datasetMultiplier = 0.7
          break
      }

      const expression = Math.min(100, Math.max(0, baseExpression * datasetMultiplier + (Math.random() - 0.5) * 20))

      data.push({
        tissue: tissueType,
        dataset: datasetType,
        expression,
        gene,
      })
    })
  })

  return data
}

const getExpressionColor = (expression: number) => {
  // Color scale from low (light blue) to high (dark red)
  const ratio = expression / 100
  if (ratio < 0.2) return "#e0f2fe" // Very light blue
  if (ratio < 0.4) return "#81d4fa" // Light blue
  if (ratio < 0.6) return "#ffeb3b" // Yellow
  if (ratio < 0.8) return "#ff9800" // Orange
  return "#d32f2f" // Dark red
}

export function ExpressionHeatmap({ selectedGene, selectedTissue, selectedDataset }: ExpressionHeatmapProps) {
  const data = useMemo(
    () => generateHeatmapData(selectedGene, selectedTissue, selectedDataset),
    [selectedGene, selectedTissue, selectedDataset],
  )

  // Filter data based on selections
  const filteredData = data.filter((d) => {
    if (selectedTissue !== "all" && d.tissue !== selectedTissue) return false
    if (selectedDataset !== "primary" && d.dataset !== "Primary Cohort") {
      // Map dataset filter values to actual dataset names
      const datasetMap = {
        primary: "Primary Cohort",
        validation: "Validation Cohort",
        tcga: "TCGA Reference",
        gtex: "GTEx Reference",
      }
      if (d.dataset !== datasetMap[selectedDataset as keyof typeof datasetMap]) return false
    }
    return true
  })

  // Organize data for heatmap display
  const tissues = [...new Set(filteredData.map((d) => d.tissue))]
  const datasets = [...new Set(filteredData.map((d) => d.dataset))]

  return (
    <div className="space-y-4">
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-96">
          {/* Header */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            <div className="text-center font-medium">{selectedGene} Expression Across Tissues and Datasets</div>
          </div>

          {/* Dataset Headers */}
          <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `120px repeat(${datasets.length}, 1fr)` }}>
            <div></div>
            {datasets.map((dataset) => (
              <div key={dataset} className="text-xs font-medium text-center p-2 bg-muted rounded">
                {dataset}
              </div>
            ))}
          </div>

          {/* Heatmap Rows */}
          {tissues.map((tissue) => (
            <div
              key={tissue}
              className="grid gap-1 mb-1"
              style={{ gridTemplateColumns: `120px repeat(${datasets.length}, 1fr)` }}
            >
              <div className="text-sm font-medium p-2 bg-muted rounded flex items-center">{tissue}</div>
              {datasets.map((dataset) => {
                const cellData = filteredData.find((d) => d.tissue === tissue && d.dataset === dataset)
                const expression = cellData?.expression || 0
                return (
                  <div
                    key={`${tissue}-${dataset}`}
                    className="h-12 rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    style={{
                      backgroundColor: getExpressionColor(expression),
                      color: expression > 60 ? "white" : "black",
                    }}
                    title={`${tissue} - ${dataset}: ${expression.toFixed(1)}%`}
                  >
                    {expression.toFixed(0)}%
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Expression Scale Legend */}
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm text-muted-foreground">Low Expression</span>
        <div className="flex space-x-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="w-6 h-4 rounded-sm" style={{ backgroundColor: getExpressionColor(i * 10) }} />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">High Expression</span>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-muted-foreground">Tissues</p>
          <p className="text-lg font-bold">{tissues.length}</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-muted-foreground">Datasets</p>
          <p className="text-lg font-bold">{datasets.length}</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-muted-foreground">Avg Expression</p>
          <p className="text-lg font-bold">
            {(filteredData.reduce((sum, d) => sum + d.expression, 0) / filteredData.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-muted-foreground">Max Expression</p>
          <p className="text-lg font-bold">{Math.max(...filteredData.map((d) => d.expression)).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}
