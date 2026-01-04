import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RoleSwitcher, type ViewRole } from "@/components/role-switcher";
import { SkillRadarChart } from "@/components/skill-radar-chart";
import { EmployeeStatsCard } from "@/components/employee-stats-card";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { MentorshipRecommendations } from "@/components/mentorship-recommendations";
import { RetentionHeatmap } from "@/components/retention-heatmap";
import { CulturalSyncPairings } from "@/components/cultural-sync-pairings";
import { SiloBreakerSearch } from "@/components/silo-breaker-search";
import { ManagerStats } from "@/components/manager-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@shared/schema";

export default function Dashboard() {
  const [viewRole, setViewRole] = useState<ViewRole>("employee");
  const { toast } = useToast();

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const currentEmployee = employees?.find(e => e.name === "Robert");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { digitalLiteracy: number; careerGoals?: string; skills?: Record<string, number>; level?: number }) => {
      if (!currentEmployee) throw new Error("No employee selected");
      return apiRequest("PATCH", `/api/employees/${currentEmployee.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-80" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[400px] col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No employee data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto h-full" data-testid="dashboard-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">
            {viewRole === "employee" ? `Welcome, ${currentEmployee?.name || "Employee"}` : "Talent Intelligence Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {viewRole === "employee" 
              ? "Manage your skills and discover mentorship opportunities" 
              : "Monitor talent risk and optimize cultural integration"}
          </p>
        </div>
        <RoleSwitcher currentRole={viewRole} onRoleChange={setViewRole} />
      </div>

      {viewRole === "employee" && currentEmployee ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SkillRadarChart employee={currentEmployee} />
            <EmployeeStatsCard employee={currentEmployee} />
          </div>
          
          <MentorshipRecommendations 
            currentEmployee={currentEmployee} 
            allEmployees={employees} 
          />
          
          <ProfileEditForm 
            employee={currentEmployee}
            onSubmit={(values) => updateProfileMutation.mutate(values)}
            isPending={updateProfileMutation.isPending}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ManagerStats employees={employees} />
          
          <RetentionHeatmap employees={employees} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <CulturalSyncPairings employees={employees} />
            <SiloBreakerSearch employees={employees} />
          </div>
        </div>
      )}
    </div>
  );
}
