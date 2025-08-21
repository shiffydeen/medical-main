"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, User, BarChart3, Dna } from "lucide-react"
import { CohortOverview } from "@/components/cohort-overview"
import { PatientStoryDashboard } from "@/components/patient-story-dashboard"
import { GeneExpressionAtlas } from "@/components/gene-expression-atlas"

export default function BiologicalDataDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("cohort")
  const [selectedGene, setSelectedGene] = useState("CD8A")
  const [navigationPath, setNavigationPath] = useState<string[]>(["Cohort Overview"])

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId)
    setActiveTab("patient")
    setNavigationPath(["Cohort Overview", `Patient ${patientId}`])
  }

  const handleReturnToCohort = () => {
    setSelectedPatient(null)
    setActiveTab("cohort")
    setNavigationPath(["Cohort Overview"])
  }

  const handleGeneSelect = (gene: string) => {
    setSelectedGene(gene)
    setActiveTab("cohort")
    setNavigationPath(["Gene Expression Atlas", "Cohort Overview", `Gene: ${gene}`])
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case "cohort":
        setNavigationPath(selectedPatient ? ["Cohort Overview", `Patient ${selectedPatient}`] : ["Cohort Overview"])
        break
      case "patient":
        if (selectedPatient) {
          setNavigationPath(["Cohort Overview", `Patient ${selectedPatient}`])
        }
        break
      case "atlas":
        setNavigationPath(["Gene Expression Atlas"])
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Biological Data Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Multi-stage analysis of cohort data, patient stories, and gene expression
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {selectedGene && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Dna className="w-3 h-3" />
                  <span>Gene: {selectedGene}</span>
                </Badge>
              )}
              {selectedPatient && (
                <Badge variant="default" className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>Patient: {selectedPatient}</span>
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3 text-sm text-muted-foreground">
            {navigationPath.map((path, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <ArrowRight className="w-3 h-3" />}
                <span className={index === navigationPath.length - 1 ? "text-foreground font-medium" : ""}>{path}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="cohort" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Cohort Overview</span>
            </TabsTrigger>
            <TabsTrigger value="patient" disabled={!selectedPatient} className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Patient Story</span>
            </TabsTrigger>
            <TabsTrigger value="atlas" className="flex items-center space-x-2">
              <Dna className="w-4 h-4" />
              <span>Gene Expression Atlas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cohort" className="space-y-6">
            <div className="flex items-center justify-between bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Current Gene:</span>
                  <span className="font-medium ml-2">{selectedGene}</span>
                </div>
                {selectedPatient && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Selected Patient:</span>
                    <span className="font-medium ml-2">{selectedPatient}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleTabChange("atlas")}>
                  Explore Atlas
                </Button>
                {selectedPatient && (
                  <Button size="sm" onClick={() => handleTabChange("patient")}>
                    View Patient Story
                  </Button>
                )}
              </div>
            </div>

            <CohortOverview onPatientSelect={handlePatientSelect} selectedGene={selectedGene} />
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            {selectedPatient ? (
              <>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Analyzing Patient:</span>
                        <span className="font-medium ml-2">{selectedPatient}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Focus Gene:</span>
                        <span className="font-medium ml-2">{selectedGene}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleTabChange("cohort")}>
                        Back to Cohort
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleTabChange("atlas")}>
                        Compare in Atlas
                      </Button>
                    </div>
                  </div>
                </div>

                <PatientStoryDashboard
                  patientId={selectedPatient}
                  onReturnToCohort={handleReturnToCohort}
                  selectedGene={selectedGene}
                />
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Select a patient from the Cohort Overview to view their story
                    </p>
                    <Button onClick={() => handleTabChange("cohort")}>Go to Cohort Overview</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="atlas" className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Atlas View:</span>
                    <span className="font-medium ml-2">Comparative Gene Expression</span>
                  </div>
                  {selectedPatient && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Context Patient:</span>
                      <span className="font-medium ml-2">{selectedPatient}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleTabChange("cohort")}>
                    Apply to Cohort
                  </Button>
                  {selectedPatient && (
                    <Button variant="outline" size="sm" onClick={() => handleTabChange("patient")}>
                      Patient Context
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <GeneExpressionAtlas
              selectedGene={selectedGene}
              onGeneSelect={handleGeneSelect}
              contextPatient={selectedPatient}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
