import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Map, Users, Briefcase } from "lucide-react";
import type { Employee } from "@shared/schema";

export default function SkillMap() {
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  const departments = [...new Set(employees?.map(e => e.department) || [])];

  const departmentColors: Record<string, { bg: string; text: string; border: string }> = {
    "Legacy Ops": { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30" },
    "Automation": { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30" },
    "Digital Sys": { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/30" },
  };

  const getAggregatedSkills = (deptEmployees: Employee[]) => {
    const skillMap: Record<string, { total: number; count: number }> = {};
    
    deptEmployees.forEach(emp => {
      const skills = emp.skills as Record<string, number>;
      Object.entries(skills).forEach(([skill, value]) => {
        if (!skillMap[skill]) {
          skillMap[skill] = { total: 0, count: 0 };
        }
        skillMap[skill].total += value;
        skillMap[skill].count += 1;
      });
    });

    return Object.entries(skillMap)
      .map(([skill, { total, count }]) => ({
        skill,
        avgValue: Math.round((total / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => b.avgValue - a.avgValue);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto h-full" data-testid="skill-map-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3" data-testid="page-title">
          <Map className="h-7 w-7 text-accent" />
          Organization Skill Map
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive view of skills across all departments
        </p>
      </div>

      <div className="grid gap-6">
        {departments.map(dept => {
          const deptEmployees = employees?.filter(e => e.department === dept) || [];
          const colors = departmentColors[dept] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
          const aggregatedSkills = getAggregatedSkills(deptEmployees);

          return (
            <Card key={dept} className={`${colors.border} border-2`} data-testid={`dept-card-${dept.replace(/\s/g, "-")}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
                      <Briefcase className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{dept}</CardTitle>
                      <CardDescription>{deptEmployees.length} team members</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border}`}>
                    {aggregatedSkills.length} unique skills
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Department Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aggregatedSkills.map(({ skill, avgValue, count }) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="gap-1.5"
                      >
                        <span className="font-medium">{skill}</span>
                        <span className="text-muted-foreground">avg: {avgValue}</span>
                        <span className="text-xs text-muted-foreground/70">({count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Team Members
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {deptEmployees.map(emp => {
                      const skills = emp.skills as Record<string, number>;
                      const topSkills = Object.entries(skills)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 2);

                      return (
                        <div 
                          key={emp.id}
                          className="flex items-center gap-3 rounded-lg border p-3 bg-card hover-elevate"
                          data-testid={`employee-card-${emp.id}`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={`${colors.bg} ${colors.text} font-semibold`}>
                              {emp.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{emp.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <Badge variant="outline" className="text-xs px-1.5">
                                L{emp.level}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {emp.tenure}y tenure
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {topSkills.map(([skill, value]) => (
                                <span key={skill} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                  {skill}: {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
