"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface PatientOutcomeChartProps {
  selectedOutcome: string
  onPatientHover: (patientId: string | null) => void
  onPatientClick: (patientId: string) => void
}

// Mock patient outcome data
const generatePatientData = (selectedOutcome: string) => {
  const allPatients = [
    { patientId: "P001", outcome: "durable", responseScore: 85, survivalMonths: 24 },
    { patientId: "P002", outcome: "early-relapse", responseScore: 25, survivalMonths: 6 },
    { patientId: "P003", outcome: "durable", responseScore: 78, survivalMonths: 22 },
    { patientId: "P004", outcome: "early-relapse", responseScore: 32, survivalMonths: 8 },
    { patientId: "P005", outcome: "durable", responseScore: 92, survivalMonths: 26 },
    { patientId: "P006", outcome: "early-relapse", responseScore: 18, survivalMonths: 4 },
    { patientId: "P007", outcome: "durable", responseScore: 88, survivalMonths: 25 },
    { patientId: "P008", outcome: "early-relapse", responseScore: 28, survivalMonths: 7 },
    { patientId: "P009", outcome: "durable", responseScore: 81, survivalMonths: 23 },
    { patientId: "P010", outcome: "early-relapse", responseScore: 22, survivalMonths: 5 },
  ]

  // Filter by selected outcome
  const filteredPatients =
    selectedOutcome === "all" ? allPatients : allPatients.filter((p) => p.outcome === selectedOutcome)

  // Group by outcome for display
  const durablePatients = filteredPatients.filter((p) => p.outcome === "durable")
  const relapsePatients = filteredPatients.filter((p) => p.outcome === "early-relapse")

  return [
    {
      outcome: "Durable Response",
      count: durablePatients.length,
      patients: durablePatients,
      avgResponseScore: durablePatients.reduce((sum, p) => sum + p.responseScore, 0) / durablePatients.length || 0,
      avgSurvival: durablePatients.reduce((sum, p) => sum + p.survivalMonths, 0) / durablePatients.length || 0,
    },
    {
      outcome: "Early Relapse",
      count: relapsePatients.length,
      patients: relapsePatients,
      avgResponseScore: relapsePatients.reduce((sum, p) => sum + p.responseScore, 0) / relapsePatients.length || 0,
      avgSurvival: relapsePatients.reduce((sum, p) => sum + p.survivalMonths, 0) / relapsePatients.length || 0,
    },
  ].filter((group) => group.count > 0)
}

export function PatientOutcomeChart({ selectedOutcome, onPatientHover, onPatientClick }: PatientOutcomeChartProps) {
  const data = useMemo(() => generatePatientData(selectedOutcome), [selectedOutcome])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.outcome}</p>
          <p className="text-sm">Patients: {data.count}</p>
          <p className="text-sm">Avg Response Score: {data.avgResponseScore.toFixed(1)}</p>
          <p className="text-sm">Avg Survival: {data.avgSurvival.toFixed(1)} months</p>
          <p className="text-xs text-muted-foreground mt-2">Click to view individual patients</p>
        </div>
      )
    }
    return null
  }

  const handleBarClick = (data: any) => {
    // For demo purposes, select the first patient in the group
    if (data.patients && data.patients.length > 0) {
      onPatientClick(data.patients[0].patientId)
    }
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="outcome" tick={{ fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            label={{ value: "Patient Count", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            onClick={handleBarClick}
            onMouseEnter={(data) => {
              // Highlight all patients in this group
              if (data.patients && data.patients.length > 0) {
                onPatientHover(data.patients[0].patientId)
              }
            }}
            onMouseLeave={() => onPatientHover(null)}
            style={{ cursor: "pointer" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.outcome === "Durable Response" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Patient List */}
      <div className="mt-4 space-y-2">
        {data.map((group) => (
          <div key={group.outcome} className="border border-border rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2">{group.outcome} Patients:</h4>
            <div className="flex flex-wrap gap-2">
              {group.patients.map((patient) => (
                <button
                  key={patient.patientId}
                  onClick={() => onPatientClick(patient.patientId)}
                  onMouseEnter={() => onPatientHover(patient.patientId)}
                  onMouseLeave={() => onPatientHover(null)}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                >
                  {patient.patientId}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
