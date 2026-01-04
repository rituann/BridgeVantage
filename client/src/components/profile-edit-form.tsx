import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Edit3, Save } from "lucide-react";
import type { Employee } from "@shared/schema";

const profileFormSchema = z.object({
  digitalLiteracy: z.number().min(1).max(10),
  careerGoals: z.string().max(500).optional(),
  skills: z.record(z.string(), z.number().min(1).max(10)),
  level: z.number().min(1).max(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  employee: Employee;
  onSubmit: (values: ProfileFormValues) => void;
  isPending?: boolean;
}

export function ProfileEditForm({ employee, onSubmit, isPending }: ProfileEditFormProps) {
  const currentSkills = employee.skills as Record<string, number>;
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      digitalLiteracy: employee.digitalLiteracy || 1,
      careerGoals: employee.careerGoals || "",
      skills: { ...currentSkills },
      level: employee.level,
    },
  });

  const skillKeys = Object.keys(currentSkills);

  return (
    <Card data-testid="card-profile-edit">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Edit3 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Edit My Profile</CardTitle>
            <CardDescription>Update your skills, level, and career goals</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Level</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                        <SelectItem key={lvl} value={String(lvl)}>
                          Level {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Your level affects risk status in the talent dashboard
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h4 className="text-sm font-medium mb-4">Technical Skills</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {skillKeys.map((skillName) => (
                  <FormField
                    key={skillName}
                    control={form.control}
                    name={`skills.${skillName}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm">{skillName.replace(/_/g, " ")}</FormLabel>
                          <span className="text-sm font-semibold text-accent" data-testid={`text-skill-value-${skillName}`}>
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="w-full"
                            data-testid={`slider-skill-${skillName}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="digitalLiteracy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Literacy Level</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="w-full"
                        data-testid="slider-digital-literacy"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginner (1)</span>
                        <span className="font-medium text-foreground">Current: {field.value}</span>
                        <span>Expert (10)</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your career aspirations and development goals..."
                      className="resize-none min-h-[100px]"
                      {...field}
                      data-testid="textarea-career-goals"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full gap-2" disabled={isPending} data-testid="button-save-profile">
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
