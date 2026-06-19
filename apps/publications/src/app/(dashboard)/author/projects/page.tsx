"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Users,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface Project {
  id: string;
  name: string;
  serviceType: string;
  assignedTeam: string;
  status: "in_progress" | "under_review" | "completed";
  progress: number;
  milestones: Milestone[];
  startDate: string;
  lastUpdated: string;
}

const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "The Last Horizon - Publishing",
    serviceType: "Book Publishing",
    assignedTeam: "Publishing Team Alpha",
    status: "in_progress",
    progress: 65,
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000 * 2).toISOString(),
    milestones: [
      { id: "m1", title: "Manuscript Review", completed: true },
      { id: "m2", title: "Interior Formatting", completed: true },
      { id: "m3", title: "Cover Design Approval", completed: false, dueDate: new Date(Date.now() + 86400000 * 5).toISOString() },
      { id: "m4", title: "ISBN Registration", completed: false },
      { id: "m5", title: "Final Proof & Distribution", completed: false },
    ],
  },
  {
    id: "proj-002",
    name: "Echoes of Tomorrow - Editing",
    serviceType: "Professional Editing",
    assignedTeam: "Editorial Team Beta",
    status: "in_progress",
    progress: 40,
    startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000 * 1).toISOString(),
    milestones: [
      { id: "m1", title: "Developmental Edit", completed: true },
      { id: "m2", title: "Line Editing", completed: false, dueDate: new Date(Date.now() + 86400000 * 7).toISOString() },
      { id: "m3", title: "Author Review", completed: false },
      { id: "m4", title: "Final Polish", completed: false },
    ],
  },
  {
    id: "proj-003",
    name: "Whispers in the Dark - Cover Design",
    serviceType: "Cover Design",
    assignedTeam: "Design Studio",
    status: "under_review",
    progress: 85,
    startDate: new Date(Date.now() - 86400000 * 21).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000 * 3).toISOString(),
    milestones: [
      { id: "m1", title: "Concept Brief", completed: true },
      { id: "m2", title: "Initial Mockups", completed: true },
      { id: "m3", title: "Revision Round 1", completed: true },
      { id: "m4", title: "Final Approval", completed: false, dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
    ],
  },
  {
    id: "proj-004",
    name: "Beyond the Stars - Audiobook",
    serviceType: "Audiobook Production",
    assignedTeam: "Audio Production Team",
    status: "in_progress",
    progress: 25,
    startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000 * 1).toISOString(),
    milestones: [
      { id: "m1", title: "Narrator Selection", completed: true },
      { id: "m2", title: "Recording Session", completed: false, dueDate: new Date(Date.now() + 86400000 * 14).toISOString() },
      { id: "m3", title: "Audio Editing", completed: false },
      { id: "m4", title: "Quality Check", completed: false },
      { id: "m5", title: "Distribution", completed: false },
    ],
  },
  {
    id: "proj-005",
    name: "River of Shadows - Marketing",
    serviceType: "Book Marketing",
    assignedTeam: "Marketing Division",
    status: "completed",
    progress: 100,
    startDate: new Date(Date.now() - 86400000 * 45).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString(),
    milestones: [
      { id: "m1", title: "Campaign Strategy", completed: true },
      { id: "m2", title: "Social Media Launch", completed: true },
      { id: "m3", title: "Email Campaign", completed: true },
      { id: "m4", title: "Performance Report", completed: true },
    ],
  },
  {
    id: "proj-006",
    name: "Crimson Dawn - Proofreading",
    serviceType: "Proofreading",
    assignedTeam: "Editorial Team Alpha",
    status: "completed",
    progress: 100,
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastUpdated: new Date(Date.now() - 86400000 * 3).toISOString(),
    milestones: [
      { id: "m1", title: "First Pass", completed: true },
      { id: "m2", title: "Second Pass", completed: true },
      { id: "m3", title: "Final Report", completed: true },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  in_progress: {
    label: "In Progress",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  under_review: {
    label: "Under Review",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  completed: {
    label: "Completed",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/author/projects");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setProjects(json.data);
      } else {
        setProjects(mockProjects);
      }
    } catch {
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "in_progress").length,
    underReview: projects.filter((p) => p.status === "under_review").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            Track your active projects and their progress.
          </p>
        </div>
        <Button
          onClick={fetchProjects}
          variant="outline"
          className="border-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/10"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-[#D8B27A]/10 p-3">
                <FolderOpen className="h-5 w-5 text-[#D8B27A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Under Review
                </p>
                <p className="text-2xl font-bold">{stats.underReview}</p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    No projects found in this category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => {
                  const status = statusConfig[project.status];
                  const completedMilestones = project.milestones.filter(
                    (m) => m.completed
                  ).length;
                  const totalMilestones = project.milestones.length;

                  return (
                    <Card
                      key={project.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold leading-tight">
                              {project.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {project.serviceType}
                            </p>
                          </div>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>

                        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project.assignedTeam}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Started {formatDate(project.startDate, "short")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5" />
                            <span>
                              {completedMilestones}/{totalMilestones}{" "}
                              milestones
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress
                              value={project.progress}
                              className="h-2 bg-[#EBC9A8]/30"
                            />
                            <div
                              className="absolute inset-0 h-2 rounded-full bg-[#D8B27A] transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Milestones
                          </p>
                          <div className="space-y-1.5">
                            {project.milestones.map((milestone) => (
                              <div
                                key={milestone.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle2
                                  className={`h-3.5 w-3.5 ${
                                    milestone.completed
                                      ? "text-[#D8B27A]"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                                <span
                                  className={
                                    milestone.completed
                                      ? "text-muted-foreground line-through"
                                      : ""
                                  }
                                >
                                  {milestone.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
