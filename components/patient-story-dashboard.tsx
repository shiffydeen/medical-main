"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { PatientMetadata } from "@/components/patient-metadata"
import { GeneExpressionTimeline } from "@/components/gene-expression-timeline"
import { RelapseRiskChart } from "@/components/relapse-risk-chart"

interface PatientStoryDashboardProps {
  patientId: string
  onReturnToCohort: () => void
  selectedGene?: string
}

export function PatientStoryDashboard({
  patientId,
  onReturnToCohort,
  selectedGene = "CD8A",
}: PatientStoryDashboardProps) {
  const [selectedTimepoint, setSelectedTimepoint] = useState("baseline")

  return (
    <div className="space-y-6">
      {/* Header with Return Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onReturnToCohort}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Cohort
        </Button>
        <h2 className="text-xl font-semibold">Patient Story: {patientId}</h2>
        <div className="text-sm text-muted-foreground">
          Focusing on <span className="font-medium">{selectedGene}</span> expression
        </div>
      </div>

      {/* Patient Metadata */}
      <PatientMetadata patientId={patientId} />

      {/* Time Point Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Collection Timepoint</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTimepoint} onValueChange={setSelectedTimepoint}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baseline">Baseline (Day 0)</SelectItem>
              <SelectItem value="week2">Week 2</SelectItem>
              <SelectItem value="week4">Week 4</SelectItem>
              <SelectItem value="week8">Week 8</SelectItem>
              <SelectItem value="week12">Week 12</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Gene Expression Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gene Expression Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">Expression levels across treatment timeline</p>
          </CardHeader>
          <CardContent>
            <GeneExpressionTimeline
              patientId={patientId}
              selectedTimepoint={selectedTimepoint}
              focusGene={selectedGene}
            />
          </CardContent>
        </Card>

        {/* Relapse Risk Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>Predicted Relapse Risk</CardTitle>
            <p className="text-sm text-muted-foreground">Risk assessment across timepoints</p>
          </CardHeader>
          <CardContent>
            <RelapseRiskChart patientId={patientId} selectedTimepoint={selectedTimepoint} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
