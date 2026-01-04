import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle, Link2, TrendingUp } from "lucide-react";
import type { Employee } from "@shared/schema";

interface ManagerStatsProps {
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

export function ManagerStats({ employees }: ManagerStatsProps) {
  const atRiskCount = employees.filter(e => getEmployeeStatus(e) === "red").length;
  const wisdomGapCount = employees.filter(e => getEmployeeStatus(e) === "amber").length;
  
  const avgSkillLevel = employees.reduce((acc, emp) => {
    const skills = emp.skills as Record<string, number>;
    const avg = Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length;
    return acc + avg;
  }, 0) / employees.length;

  const activePairings = Math.min(
    employees.filter(e => e.tenure >= 10).length,
    employees.filter(e => e.tenure <= 4 && e.level >= 4).length
  );

  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: Users,
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "At-Risk Talent",
      value: atRiskCount,
      icon: AlertTriangle,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Potential Pairings",
      value: activePairings,
      icon: Link2,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Avg Skill Level",
      value: avgSkillLevel.toFixed(1),
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="manager-stats">
      {stats.map((stat, index) => (
        <Card key={stat.label} data-testid={`stat-card-${index}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid={`stat-value-${index}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
