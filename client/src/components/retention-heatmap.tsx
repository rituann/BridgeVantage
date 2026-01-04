import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Grid3x3, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import type { Employee } from "@shared/schema";

interface RetentionHeatmapProps {
  employees: Employee[];
}

function getEmployeeStatus(employee: Employee): "red" | "amber" | "green" {
  const skills = employee.skills as Record<string, number>;
  const maxSkill = Math.max(...Object.values(skills));
  const isHighPerformer = maxSkill > 8;
  const isStagnant = employee.level < 4;
  const hasWisdomGap = employee.tenure > 15 && employee.level < 4;

  if (isHighPerformer && isStagnant) return "red";
  if (hasWisdomGap) return "amber";
  return "green";
}

function getStatusLabel(status: "red" | "amber" | "green"): string {
  switch (status) {
    case "red": return "At Risk";
    case "amber": return "Wisdom Gap";
    case "green": return "Stable";
  }
}

export function RetentionHeatmap({ employees }: RetentionHeatmapProps) {
  const stats = {
    red: employees.filter(e => getEmployeeStatus(e) === "red").length,
    amber: employees.filter(e => getEmployeeStatus(e) === "amber").length,
    green: employees.filter(e => getEmployeeStatus(e) === "green").length,
  };

  return (
    <Card className="col-span-full" data-testid="card-retention-heatmap">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Grid3x3 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Retention Heatmap</CardTitle>
              <CardDescription>Talent risk visualization across the organization</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">At Risk ({stats.red})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm text-muted-foreground">Wisdom Gap ({stats.amber})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">Stable ({stats.green})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {employees.map(employee => {
            const status = getEmployeeStatus(employee);
            const skills = employee.skills as Record<string, number>;
            const bgColor = status === "red" 
              ? "bg-red-500/15 border-red-500/30 hover:bg-red-500/20" 
              : status === "amber" 
              ? "bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/20" 
              : "bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/20";

            const StatusIcon = status === "red" 
              ? AlertTriangle 
              : status === "amber" 
              ? AlertCircle 
              : CheckCircle;

            const iconColor = status === "red" 
              ? "text-red-500" 
              : status === "amber" 
              ? "text-amber-500" 
              : "text-emerald-500";

            return (
              <Tooltip key={employee.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex flex-col gap-2 rounded-lg border p-4 transition-all cursor-pointer ${bgColor}`}
                    data-testid={`heatmap-cell-${employee.id}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <p className="font-semibold text-sm" data-testid={`text-employee-name-${employee.id}`}>
                          {employee.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                      <StatusIcon className={`h-4 w-4 flex-shrink-0 ${iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        L{employee.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {employee.tenure}y
                      </Badge>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{employee.name}</span>
                      <Badge variant={status === "red" ? "destructive" : status === "amber" ? "secondary" : "outline"}>
                        {getStatusLabel(status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {employee.department} | Level {employee.level} | {employee.tenure} years
                    </p>
                    <div className="pt-1 border-t">
                      <p className="text-xs font-medium mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(skills).map(([skill, value]) => (
                          <span key={skill} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {skill}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    {employee.risk && (
                      <p className="text-xs text-muted-foreground">Risk: {employee.risk}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
