import { Button } from "@/components/ui/button";
import { Users, UserCircle } from "lucide-react";

export type ViewRole = "employee" | "manager";

interface RoleSwitcherProps {
  currentRole: ViewRole;
  onRoleChange: (role: ViewRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex items-center gap-2" data-testid="role-switcher">
      <Button
        variant={currentRole === "employee" ? "default" : "outline"}
        size="sm"
        onClick={() => onRoleChange("employee")}
        className="gap-2"
        data-testid="button-view-employee"
      >
        <UserCircle className="h-4 w-4" />
        View as Employee: Robert
      </Button>
      <Button
        variant={currentRole === "manager" ? "default" : "outline"}
        size="sm"
        onClick={() => onRoleChange("manager")}
        className="gap-2"
        data-testid="button-view-manager"
      >
        <Users className="h-4 w-4" />
        View as Talent Manager
      </Button>
    </div>
  );
}
