"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ExpressionHeatmap } from "@/components/expression-heatmap"
import { ExpressionViolin } from "@/components/expression-violin"

interface GeneExpressionAtlasProps {
  selectedGene?: string
  onGeneSelect?: (gene: string) => void
  contextPatient?: string | null
}

export function GeneExpressionAtlas({
  selectedGene: initialGene = "CD8A",
  onGeneSelect,
  contextPatient,
}: GeneExpressionAtlasProps) {
  const [selectedGene, setSelectedGene] = useState(initialGene)
  const [selectedTissue, setSelectedTissue] = useState("all")
  const [selectedDataset, setSelectedDataset] = useState("primary")

  const handleGeneChange = (gene: string) => {
    setSelectedGene(gene)
    if (onGeneSelect) {
      onGeneSelect(gene)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Atlas Filters</CardTitle>
          {contextPatient && (
            <p className="text-sm text-muted-foreground">
              Comparing with patient <span className="font-medium">{contextPatient}</span> context
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gene</label>
              <Select value={selectedGene} onValueChange={handleGeneChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CD8A">CD8A</SelectItem>
                  <SelectItem value="PDCD1">PDCD1</SelectItem>
                  <SelectItem value="LAG3">LAG3</SelectItem>
                  <SelectItem value="HAVCR2">HAVCR2</SelectItem>
                  <SelectItem value="TIGIT">TIGIT</SelectItem>
                  <SelectItem value="CTLA4">CTLA4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tissue</label>
              <Select value={selectedTissue} onValueChange={setSelectedTissue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tissues</SelectItem>
                  <SelectItem value="tumor">Tumor</SelectItem>
                  <SelectItem value="blood">Blood</SelectItem>
                  <SelectItem value="lymph-node">Lymph Node</SelectItem>
                  <SelectItem value="bone-marrow">Bone Marrow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dataset</label>
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Cohort</SelectItem>
                  <SelectItem value="validation">Validation Cohort</SelectItem>
                  <SelectItem value="tcga">TCGA Reference</SelectItem>
                  <SelectItem value="gtex">GTEx Reference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {onGeneSelect && (
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => onGeneSelect(selectedGene)}>
                Apply to Cohort View
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Atlas Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expression Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Expression Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground">{selectedGene} expression across tissues and datasets</p>
          </CardHeader>
          <CardContent>
            <ExpressionHeatmap
              selectedGene={selectedGene}
              selectedTissue={selectedTissue}
              selectedDataset={selectedDataset}
            />
          </CardContent>
        </Card>

        {/* Expression Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expression Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Detailed distribution analysis</p>
          </CardHeader>
          <CardContent>
            <ExpressionViolin
              selectedGene={selectedGene}
              selectedTissue={selectedTissue}
              selectedDataset={selectedDataset}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
