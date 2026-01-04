import { useMemo } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import type { Employee } from "@shared/schema";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillRadarChartProps {
  employee: Employee;
}

export function SkillRadarChart({ employee }: SkillRadarChartProps) {
  const chartData = useMemo(() => {
    const skills = employee.skills as Record<string, number>;
    const labels = Object.keys(skills);
    const dataValues = Object.values(skills);

    return {
      labels,
      datasets: [
        {
          label: `${employee.name}'s Skills`,
          data: dataValues,
          backgroundColor: "rgba(30, 64, 175, 0.2)",
          borderColor: "hsl(210, 100%, 52%)",
          borderWidth: 2,
          pointBackgroundColor: "hsl(210, 100%, 52%)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "hsl(210, 100%, 52%)",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [employee]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: "rgba(100, 116, 139, 0.2)",
        },
        grid: {
          color: "rgba(100, 116, 139, 0.2)",
        },
        pointLabels: {
          color: "hsl(220, 15%, 40%)",
          font: {
            size: 12,
            weight: 500 as const,
            family: "Inter, sans-serif",
          },
        },
        ticks: {
          color: "hsl(220, 15%, 50%)",
          backdropColor: "transparent",
          stepSize: 2,
          font: {
            size: 10,
          },
        },
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(220, 60%, 11%)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "hsl(210, 100%, 52%)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <Card className="col-span-2" data-testid="card-skill-radar">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <User className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{employee.name}'s Skill Radar</CardTitle>
            <p className="text-sm text-muted-foreground">Visual breakdown of competencies</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[320px] w-full">
          <Radar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
