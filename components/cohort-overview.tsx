"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { UMAPScatterPlot } from "@/components/umap-scatter-plot"
import { PatientOutcomeChart } from "@/components/patient-outcome-chart"

interface CohortOverviewProps {
  onPatientSelect: (patientId: string) => void
  selectedGene?: string
}

export function CohortOverview({ onPatientSelect, selectedGene: initialGene = "CD8A" }: CohortOverviewProps) {
  const [selectedGene, setSelectedGene] = useState(initialGene)
  const [selectedOutcome, setSelectedOutcome] = useState("all")
  const [expressionRange, setExpressionRange] = useState([0, 100])
  const [hoveredPatient, setHoveredPatient] = useState<string | null>(null)

  useEffect(() => {
    setSelectedGene(initialGene)
  }, [initialGene])

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gene</label>
              <Select value={selectedGene} onValueChange={setSelectedGene}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CD8A">CD8A</SelectItem>
                  <SelectItem value="PDCD1">PDCD1</SelectItem>
                  <SelectItem value="LAG3">LAG3</SelectItem>
                  <SelectItem value="HAVCR2">HAVCR2</SelectItem>
                  <SelectItem value="TIGIT">TIGIT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Outcome</label>
              <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="durable">Durable Response</SelectItem>
                  <SelectItem value="early-relapse">Early Relapse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Expression Range: {expressionRange[0]}% - {expressionRange[1]}%
              </label>
              <Slider
                value={expressionRange}
                onValueChange={setExpressionRange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UMAP Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle>UMAP Cell Visualization</CardTitle>
            <p className="text-sm text-muted-foreground">
              Each point represents a cell, colored by {selectedGene} expression
            </p>
          </CardHeader>
          <CardContent>
            <UMAPScatterPlot
              selectedGene={selectedGene}
              expressionRange={expressionRange}
              hoveredPatient={hoveredPatient}
              onCellClick={onPatientSelect}
            />
          </CardContent>
        </Card>

        {/* Patient Outcome Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Clinical Outcomes</CardTitle>
            <p className="text-sm text-muted-foreground">Grouped by treatment response</p>
          </CardHeader>
          <CardContent>
            <PatientOutcomeChart
              selectedOutcome={selectedOutcome}
              onPatientHover={setHoveredPatient}
              onPatientClick={onPatientSelect}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
