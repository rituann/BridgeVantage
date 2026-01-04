import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { Employee } from "@shared/schema";

interface EmployeeStatsCardProps {
  employee: Employee;
}

export function EmployeeStatsCard({ employee }: EmployeeStatsCardProps) {
  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case "High Flight Risk":
        return "destructive";
      case "Underutilized":
        return "secondary";
      case "Needs Context":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card data-testid="card-employee-stats">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium" data-testid="text-department">{employee.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tenure</p>
            <p className="font-medium" data-testid="text-tenure">{employee.tenure} years</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="font-medium" data-testid="text-level">Level {employee.level}</p>
          </div>
        </div>

        {employee.risk && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Status</p>
              <Badge variant={getRiskColor(employee.risk)} data-testid="badge-risk">
                {employee.risk}
              </Badge>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">Digital Literacy</p>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-accent transition-all" 
                style={{ width: `${(employee.digitalLiteracy || 1) * 10}%` }}
                data-testid="progress-digital-literacy"
              />
            </div>
            <span className="text-sm font-medium" data-testid="text-digital-literacy">
              {employee.digitalLiteracy || 1}/10
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
