"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PatientMetadataProps {
  patientId: string
}

// Mock patient metadata
const getPatientMetadata = (patientId: string) => {
  const metadata = {
    P001: {
      age: 65,
      gender: "M",
      stage: "IIIA",
      outcome: "Durable Response",
      clusterId: "C1",
      treatmentArm: "Immunotherapy",
    },
    P002: { age: 58, gender: "F", stage: "IV", outcome: "Early Relapse", clusterId: "C3", treatmentArm: "Combination" },
    P003: {
      age: 72,
      gender: "M",
      stage: "IIIB",
      outcome: "Durable Response",
      clusterId: "C1",
      treatmentArm: "Immunotherapy",
    },
    P004: {
      age: 61,
      gender: "F",
      stage: "IV",
      outcome: "Early Relapse",
      clusterId: "C2",
      treatmentArm: "Chemotherapy",
    },
    P005: {
      age: 69,
      gender: "M",
      stage: "IIIA",
      outcome: "Durable Response",
      clusterId: "C1",
      treatmentArm: "Combination",
    },
    P006: {
      age: 54,
      gender: "F",
      stage: "IV",
      outcome: "Early Relapse",
      clusterId: "C3",
      treatmentArm: "Chemotherapy",
    },
    P007: {
      age: 67,
      gender: "M",
      stage: "IIIB",
      outcome: "Durable Response",
      clusterId: "C1",
      treatmentArm: "Immunotherapy",
    },
    P008: { age: 63, gender: "F", stage: "IV", outcome: "Early Relapse", clusterId: "C2", treatmentArm: "Combination" },
    P009: {
      age: 70,
      gender: "M",
      stage: "IIIA",
      outcome: "Durable Response",
      clusterId: "C1",
      treatmentArm: "Immunotherapy",
    },
    P010: {
      age: 56,
      gender: "F",
      stage: "IV",
      outcome: "Early Relapse",
      clusterId: "C3",
      treatmentArm: "Chemotherapy",
    },
  }

  return (
    metadata[patientId as keyof typeof metadata] || {
      age: 65,
      gender: "Unknown",
      stage: "Unknown",
      outcome: "Unknown",
      clusterId: "Unknown",
      treatmentArm: "Unknown",
    }
  )
}

export function PatientMetadata({ patientId }: PatientMetadataProps) {
  const metadata = getPatientMetadata(patientId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
            <p className="font-mono">{patientId}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p>{metadata.age} years</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p>{metadata.gender}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Disease Stage</p>
            <Badge variant="outline">{metadata.stage}</Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Clinical Status</p>
            <Badge variant={metadata.outcome === "Durable Response" ? "default" : "destructive"}>
              {metadata.outcome}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Cluster ID</p>
            <Badge variant="secondary">{metadata.clusterId}</Badge>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Treatment Arm</p>
            <p>{metadata.treatmentArm}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
