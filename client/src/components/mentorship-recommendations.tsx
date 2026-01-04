import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, ArrowRight, Users } from "lucide-react";
import type { Employee } from "@shared/schema";

interface MentorMatch {
  mentor: Employee;
  matchScore: number;
}

interface MentorshipRecommendationsProps {
  currentEmployee: Employee;
  allEmployees: Employee[];
}

function calculateMatchScore(employee: Employee, mentor: Employee): number {
  const tenureDiff = Math.abs(mentor.tenure - employee.tenure);
  const employeeSkills = employee.skills as Record<string, number>;
  const mentorSkills = mentor.skills as Record<string, number>;
  
  const digitalSkills = ["AI", "Python", "Cloud", "Security", "Analytics", "Robotics", "Cyber", "Design"];
  
  let digitalGap = 0;
  let gapCount = 0;
  digitalSkills.forEach(skill => {
    const mentorSkill = mentorSkills[skill] || 0;
    const employeeSkill = employeeSkills[skill] || 0;
    if (mentorSkill > employeeSkill) {
      digitalGap += mentorSkill - employeeSkill;
      gapCount++;
    }
  });

  const avgGap = gapCount > 0 ? digitalGap / gapCount : 0;
  const score = (tenureDiff * 0.4) + (avgGap * 0.6);
  return Math.round(score);
}

export function MentorshipRecommendations({ currentEmployee, allEmployees }: MentorshipRecommendationsProps) {
  const potentialMentors = allEmployees
    .filter(emp => 
      emp.id !== currentEmployee.id && 
      emp.department === "Automation" && 
      emp.level >= 5
    )
    .map(mentor => ({
      mentor,
      matchScore: calculateMatchScore(currentEmployee, mentor),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return (
    <Card className="col-span-full" data-testid="card-mentorship">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">The Bridge - Reverse Mentorship</CardTitle>
            <CardDescription>Connect with Automation leads to enhance your digital skills</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {potentialMentors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No matching mentors found at this time</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {potentialMentors.map(({ mentor, matchScore }) => {
              const mentorSkills = mentor.skills as Record<string, number>;
              const topSkills = Object.entries(mentorSkills)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);

              return (
                <div
                  key={mentor.id}
                  className="flex flex-col gap-4 rounded-lg border bg-card p-4 hover-elevate"
                  data-testid={`card-mentor-${mentor.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 border-2 border-accent/20">
                        <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                          {mentor.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold" data-testid={`text-mentor-name-${mentor.id}`}>{mentor.name}</p>
                        <p className="text-sm text-muted-foreground">{mentor.department}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-semibold" data-testid={`badge-match-score-${mentor.id}`}>
                      {matchScore} pts
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Skills to Learn</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topSkills.map(([skill, value]) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full gap-2 mt-auto" data-testid={`button-request-mentorship-${mentor.id}`}>
                    Request Mentorship
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
