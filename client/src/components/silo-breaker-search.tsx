import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Layers, Users } from "lucide-react";
import type { Employee } from "@shared/schema";

interface SiloBreakerSearchProps {
  employees: Employee[];
}

export function SiloBreakerSearch({ employees }: SiloBreakerSearchProps) {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: Array<{ employee: Employee; matchedSkills: string[] }> = [];

    employees.forEach(employee => {
      const skills = employee.skills as Record<string, number>;
      const matchedSkills = Object.keys(skills)
        .filter(skill => skill.toLowerCase().includes(lowerQuery));
      
      if (matchedSkills.length > 0) {
        results.push({ employee, matchedSkills });
      }
    });

    return results.sort((a, b) => {
      const aMax = Math.max(...a.matchedSkills.map(s => (a.employee.skills as Record<string, number>)[s] || 0));
      const bMax = Math.max(...b.matchedSkills.map(s => (b.employee.skills as Record<string, number>)[s] || 0));
      return bMax - aMax;
    });
  }, [query, employees]);

  const departmentColors: Record<string, string> = {
    "Legacy Ops": "bg-amber-500/15 text-amber-600 border-amber-500/30",
    "Automation": "bg-blue-500/15 text-blue-600 border-blue-500/30",
    "Digital Sys": "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  };

  return (
    <Card data-testid="card-silo-breaker">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Layers className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Silo-Breaker Search</CardTitle>
            <CardDescription>Find skills across different departments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for skills (e.g., Python, QA, Security)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            data-testid="input-skill-search"
          />
        </div>

        {query.trim() === "" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Users className="h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">Search for a skill to discover talent across departments</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Search className="h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">No employees found with skills matching "{query}"</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {searchResults.map(({ employee, matchedSkills }) => {
              const skills = employee.skills as Record<string, number>;
              return (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover-elevate"
                  data-testid={`search-result-${employee.id}`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted text-sm font-medium">
                      {employee.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm" data-testid={`text-result-name-${employee.id}`}>
                        {employee.name}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${departmentColors[employee.department] || ""}`}
                      >
                        {employee.department}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {matchedSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}: {skills[skill]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
