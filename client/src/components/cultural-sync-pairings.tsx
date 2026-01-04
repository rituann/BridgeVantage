import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link2, ArrowLeftRight } from "lucide-react";
import type { Employee } from "@shared/schema";

interface CulturalSyncPairingsProps {
  employees: Employee[];
}

interface Pairing {
  senior: Employee;
  junior: Employee;
  connectionScore: number;
  skillsToShare: string[];
}

function generatePairings(employees: Employee[]): Pairing[] {
  const seniors = employees
    .filter(e => e.tenure >= 10)
    .sort((a, b) => b.tenure - a.tenure);
  
  const juniors = employees
    .filter(e => e.tenure <= 4 && e.level >= 4)
    .sort((a, b) => b.level - a.level);

  const pairings: Pairing[] = [];

  seniors.forEach(senior => {
    juniors.forEach(junior => {
      if (senior.department !== junior.department) {
        const seniorSkills = senior.skills as Record<string, number>;
        const juniorSkills = junior.skills as Record<string, number>;
        
        const skillsToShare = Object.keys(seniorSkills)
          .filter(skill => (seniorSkills[skill] || 0) > (juniorSkills[skill] || 0) + 3)
          .slice(0, 2);

        if (skillsToShare.length > 0) {
          const tenureWeight = Math.min(senior.tenure / 25, 1) * 50;
          const skillGap = skillsToShare.reduce((acc, skill) => 
            acc + ((seniorSkills[skill] || 0) - (juniorSkills[skill] || 0)), 0) * 5;
          const connectionScore = Math.min(Math.round(tenureWeight + skillGap), 100);

          pairings.push({
            senior,
            junior,
            connectionScore,
            skillsToShare,
          });
        }
      }
    });
  });

  return pairings.sort((a, b) => b.connectionScore - a.connectionScore).slice(0, 3);
}

export function CulturalSyncPairings({ employees }: CulturalSyncPairingsProps) {
  const topPairings = generatePairings(employees);

  return (
    <Card data-testid="card-cultural-sync">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Link2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Cultural Sync List</CardTitle>
            <CardDescription>Top Senior-Junior knowledge transfer pairings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {topPairings.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No suitable pairings found at this time
            </div>
          ) : (
            topPairings.map((pairing, index) => (
              <div
                key={`${pairing.senior.id}-${pairing.junior.id}`}
                className="flex items-center justify-between rounded-lg border bg-card p-5 overflow-hidden relative"
                data-testid={`pairing-row-${index}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 border-amber-500/30">
                    <AvatarFallback className="bg-amber-500/10 text-amber-600 font-semibold text-sm">
                      {pairing.senior.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 overflow-hidden">
                    <p 
                      className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis" 
                      data-testid={`text-senior-${index}`}
                    >
                      {pairing.senior.name}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs px-1.5">
                        {pairing.senior.tenure}y
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        {pairing.senior.department}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex-grow-0 basis-[120px] flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                    <div className="h-0.5 w-6 bg-accent/50" />
                    <ArrowLeftRight className="h-4 w-4 text-accent" />
                    <div className="h-0.5 w-6 bg-accent/50" />
                    <div className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                  </div>
                  <Badge variant="secondary" className="text-xs" data-testid={`badge-connection-${index}`}>
                    {pairing.connectionScore}%
                  </Badge>
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                  <div className="min-w-0 overflow-hidden text-right">
                    <p 
                      className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis" 
                      data-testid={`text-junior-${index}`}
                    >
                      {pairing.junior.name}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        {pairing.junior.department}
                      </span>
                      <Badge variant="outline" className="text-xs px-1.5">
                        L{pairing.junior.level}
                      </Badge>
                    </div>
                  </div>
                  <Avatar className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 border-accent/30">
                    <AvatarFallback className="bg-accent/10 text-accent font-semibold text-sm">
                      {pairing.junior.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
