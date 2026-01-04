# BridgeVantage - Official System Documentation

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Classification:** Technical Reference

---

## Table of Contents

1. [Technology Stack & Versions](#technology-stack--versions)
2. [Architectural Blueprint](#1-architectural-blueprint)
3. [The Data DNA (Entity Definitions)](#2-the-data-dna-entity-definitions)
4. [Computational Logic & Algorithms](#3-computational-logic--algorithms)
5. [UI Engineering & Layout Stability](#4-ui-engineering--layout-stability)
6. [Integration & Scalability](#5-integration--scalability)

---

## Technology Stack & Versions

### Frontend Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | Core UI framework with functional components and hooks |
| TypeScript | 5.6.3 | Static type checking and enhanced developer experience |
| Vite | ^7.3.0 | Build tool and development server with HMR |
| Tailwind CSS | ^3.4.17 | Utility-first CSS framework |
| Chart.js | ^4.5.1 | Radar chart visualizations |
| react-chartjs-2 | ^5.3.1 | React wrapper for Chart.js |
| TanStack React Query | ^5.60.5 | Server state management and caching |
| wouter | ^3.3.5 | Lightweight client-side routing |
| react-hook-form | ^7.55.0 | Form state management |
| Zod | ^3.24.2 | Runtime schema validation |
| Radix UI | ^1.x-2.x | Accessible UI primitives |
| Lucide React | ^0.453.0 | Icon library |
| Framer Motion | ^11.13.1 | Animation library |

### Backend Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | JavaScript runtime environment |
| Express | ^4.21.2 | Web application framework |
| TypeScript | 5.6.3 | Type-safe server development |
| tsx | ^4.20.5 | TypeScript execution for development |
| esbuild | ^0.25.0 | Production bundling |

### Data Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15.x | Primary relational database |
| Drizzle ORM | ^0.39.3 | Type-safe database ORM |
| drizzle-zod | ^0.7.0 | Zod schema generation from Drizzle |
| drizzle-kit | ^0.31.8 | Database migration tooling |
| pg | ^8.16.3 | PostgreSQL client for Node.js |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| Vite Plugin React | ^4.7.0 | React Fast Refresh and JSX transform |
| PostCSS | ^8.4.47 | CSS processing |
| Autoprefixer | ^10.4.20 | Vendor prefix automation |
| tailwindcss-animate | ^1.0.7 | Animation utilities |

---

## 1. Architectural Blueprint

### System Design: MVC-Inspired Architecture

BridgeVantage implements a **Model-View-Controller (MVC)** inspired architecture adapted for modern full-stack JavaScript development, utilizing Express.js for the backend API layer and React for the frontend presentation layer.

```
                    ┌─────────────────────────────────────────┐
                    │            CLIENT LAYER                  │
                    │  ┌─────────────────────────────────────┐ │
                    │  │     React 18 + TypeScript           │ │
                    │  │  ┌─────────┐  ┌─────────────────┐   │ │
                    │  │  │  Views  │  │   Controllers   │   │ │
                    │  │  │ (Pages) │  │ (React Query)   │   │ │
                    │  │  └─────────┘  └─────────────────┘   │ │
                    │  └─────────────────────────────────────┘ │
                    └───────────────────┬─────────────────────┘
                                        │ HTTP/JSON
                    ┌───────────────────▼─────────────────────┐
                    │            SERVER LAYER                  │
                    │  ┌─────────────────────────────────────┐ │
                    │  │     Express.js + TypeScript         │ │
                    │  │  ┌─────────┐  ┌─────────────────┐   │ │
                    │  │  │ Routes  │  │    Storage      │   │ │
                    │  │  │  (API)  │  │   Interface     │   │ │
                    │  │  └─────────┘  └─────────────────┘   │ │
                    │  └─────────────────────────────────────┘ │
                    └───────────────────┬─────────────────────┘
                                        │ Drizzle ORM
                    ┌───────────────────▼─────────────────────┐
                    │            DATA LAYER                    │
                    │  ┌─────────────────────────────────────┐ │
                    │  │          PostgreSQL                  │ │
                    │  │    (employees, users tables)         │ │
                    │  └─────────────────────────────────────┘ │
                    └─────────────────────────────────────────┘
```

#### Component Breakdown

**Model Layer (`shared/schema.ts`):**
- Defines database schemas using Drizzle ORM
- Generates Zod validation schemas via `drizzle-zod`
- Exports TypeScript types shared between client and server
- Single source of truth for data structures

**View Layer (`client/src/pages/`, `client/src/components/`):**
- React functional components with hooks
- Shadcn/ui component library built on Radix primitives
- Chart.js integration for data visualization
- Tailwind CSS for styling with CSS variables for theming

**Controller Layer:**
- **Server-side** (`server/routes.ts`): Express route handlers for RESTful API
- **Client-side** (`@tanstack/react-query`): Manages server state, caching, and mutations
- **Storage Interface** (`server/storage.ts`): Abstracts database operations

### Role-Based Logic: Switchable UI Implementation

The application implements a **client-side role switching mechanism** that enables instant toggling between Employee and Talent Manager views without page reload or re-authentication.

#### Implementation Architecture

```typescript
// State Management in App.tsx
const [userRole, setUserRole] = useState<"employee" | "manager">("employee");

// Role Switcher Component
<Select value={userRole} onValueChange={(val) => setUserRole(val)}>
  <SelectItem value="employee">Employee View</SelectItem>
  <SelectItem value="manager">Talent Manager</SelectItem>
</Select>
```

#### Role-Specific Rendering Logic

```typescript
// Conditional Dashboard Rendering
{userRole === "employee" ? (
  <EmployeeView>
    <SkillRadarChart employee={currentEmployee} />
    <ProfileEditForm employee={currentEmployee} onSubmit={handleUpdate} />
    <MentorshipRecommendations currentEmployee={currentEmployee} />
  </EmployeeView>
) : (
  <ManagerView>
    <RetentionHeatmap employees={allEmployees} />
    <CulturalSyncPairings employees={allEmployees} />
    <SiloBreakerSearch employees={allEmployees} />
  </ManagerView>
)}
```

#### Key Design Decisions

1. **No Page Reload:** React state management enables instant view switching
2. **Shared Data Layer:** Both views consume the same `/api/employees` endpoint
3. **Real-Time Synchronization:** Profile updates via mutation immediately invalidate the query cache, ensuring manager view reflects current data
4. **Component Isolation:** Each role has dedicated components, preventing logic leakage

---

## 2. The Data DNA (Entity Definitions)

### Persona Mapping: Strategic Employee Dataset

The 10-person dummy dataset was carefully designed to represent specific organizational friction points common in enterprises undergoing digital transformation.

| Employee | Department | Tenure | Level | Primary Friction Point |
|----------|------------|--------|-------|------------------------|
| **Robert** | Legacy Ops | 18y | 3 | Stagnant High-Performer: Deep mechanical expertise (9/10) but low digital literacy (2/10). Represents employees whose institutional knowledge is at risk of becoming obsolete. |
| **Maya** | Automation | 2y | 6 | Context-Deficient Talent: High AI/Python skills but lacks domain wisdom (3/10). Represents new hires who need legacy knowledge transfer. |
| **Elena** | Legacy Ops | 22y | 4 | High Flight Risk: Maximum QA/Safety expertise facing potential obsolescence. Critical institutional memory at risk of departure. |
| **James** | Digital Sys | 1y | 4 | New Digital Native: Cloud/Security specialist with minimal institutional context. Prime candidate for senior mentorship. |
| **David** | Automation | 4y | 5 | Bridge Builder: Rare combination of robotics and legacy mechanics. Natural cross-departmental liaison. |
| **Sarah** | Digital Sys | 3y | 3 | Emerging Talent: Analytics/UX focus with growth potential. Represents next-generation workforce. |
| **Frank** | Legacy Ops | 15y | 2 | Wisdom Gap: High tenure, low level indicates underutilization. Risk of disengagement. |
| **Chloe** | Automation | 2y | 5 | ML Specialist: Strong technical skills, needs institutional grounding. |
| **Victor** | Digital Sys | 8y | 6 | Balanced Senior: Mid-career with both technical depth and organizational tenure. |
| **Lisa** | Legacy Ops | 12y | 3 | Documentation Expert: Process knowledge critical for digital transformation initiatives. |

### PostgreSQL Schema Definition

```sql
CREATE TABLE employees (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    tenure INTEGER NOT NULL,           -- Years at organization
    level INTEGER NOT NULL,            -- Career level (1-10 scale)
    skills JSONB NOT NULL,             -- Dynamic skill map
    risk TEXT,                         -- Risk classification label
    digital_literacy INTEGER DEFAULT 1, -- Digital proficiency (1-10)
    career_goals TEXT                  -- Free-text career aspirations
);
```

#### Skills JSONB Structure

The `skills` field stores a flexible key-value mapping of competencies to proficiency levels:

```json
{
  "Mechanical": 9,
  "Precision": 9,
  "IoT": 2,
  "AI": 0,
  "Python": 0
}
```

**Design Rationale:**
- **JSONB over relational:** Enables schema-less skill additions without migrations
- **Integer scoring (1-10):** Normalized scale for cross-employee comparison
- **Sparse representation:** Only relevant skills stored per employee
- **Query efficiency:** PostgreSQL JSONB operators enable efficient skill-based filtering

#### Drizzle ORM Schema

```typescript
// shared/schema.ts
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  department: text("department").notNull(),
  tenure: integer("tenure").notNull(),
  level: integer("level").notNull(),
  skills: jsonb("skills").notNull().$type<Record<string, number>>(),
  risk: text("risk"),
  digitalLiteracy: integer("digital_literacy").default(1),
  careerGoals: text("career_goals"),
});
```

---

## 3. Computational Logic & Algorithms

### The Wisdom-Sync Formula: Mentorship Match Scoring

The mentorship recommendation engine calculates compatibility scores using a weighted formula that balances tenure-based experience with skill complementarity.

#### Formal Equation

$$
\text{Match Score} = (\text{Tenure Difference} \times 0.4) + (\text{Digital Skill Gap} \times 0.6)
$$

Where:
- **Tenure Difference** = `mentor.tenure - mentee.tenure` (years of experience gap)
- **Digital Skill Gap** = Average difference in digital skill values where mentor exceeds mentee

#### Implementation

```typescript
function calculateMatchScore(mentor: Employee, mentee: Employee): number {
  const tenureDiff = mentor.tenure - mentee.tenure;
  
  const mentorSkills = mentor.skills as Record<string, number>;
  const menteeSkills = mentee.skills as Record<string, number>;
  
  let digitalGap = 0;
  let gapCount = 0;
  
  const digitalSkills = ["AI", "Python", "Cloud", "IoT", "ML", "Analytics"];
  
  digitalSkills.forEach(skill => {
    const mentorLevel = mentorSkills[skill] || 0;
    const menteeLevel = menteeSkills[skill] || 0;
    if (mentorLevel > menteeLevel) {
      digitalGap += (mentorLevel - menteeLevel);
      gapCount++;
    }
  });

  const avgGap = gapCount > 0 ? digitalGap / gapCount : 0;
  const score = (tenureDiff * 0.4) + (avgGap * 0.6);
  return Math.round(score);
}
```

#### Scoring Interpretation

| Score Range | Interpretation |
|-------------|----------------|
| 15+ pts | Excellent match - significant experience and skill transfer potential |
| 10-14 pts | Good match - meaningful mentorship opportunity |
| 5-9 pts | Moderate match - limited but valuable knowledge exchange |
| <5 pts | Weak match - consider alternative pairings |

### Retention Risk Engine: Heatmap Classification

The retention heatmap employs conditional logic to classify employees into risk categories based on the intersection of performance indicators and career trajectory.

#### Risk Classification Logic

```typescript
function determineRiskStatus(employee: Employee): "red" | "amber" | "green" {
  const skills = employee.skills as Record<string, number>;
  const maxSkill = Math.max(...Object.values(skills));
  
  // RED: Stagnant High-Performer
  // High skill ceiling but low career level indicates blocked advancement
  if (maxSkill > 8 && employee.level < 4) {
    return "red";
  }
  
  // AMBER: Wisdom Gap Risk
  // High tenure without career progression suggests disengagement
  if (employee.tenure > 15 && employee.level < 4) {
    return "amber";
  }
  
  // GREEN: Stable
  // No immediate risk indicators detected
  return "green";
}
```

#### Risk Category Definitions

| Status | Condition | Organizational Risk | Recommended Action |
|--------|-----------|--------------------|--------------------|
| **RED** | `maxSkill > 8 AND level < 4` | High flight risk. Top performers blocked from advancement may seek external opportunities. | Immediate career path review, promotion consideration, or expanded responsibilities. |
| **AMBER** | `tenure > 15 AND level < 4` | Knowledge loss risk. Senior employees with deep institutional memory showing signs of stagnation. | Mentorship role assignment, knowledge documentation initiatives. |
| **GREEN** | Default | Stable. No immediate intervention required. | Continue monitoring through regular check-ins. |

#### Visual Representation

```
Risk Heatmap Color Coding:
┌────────────────────────────────────────────┐
│  🔴 RED    │ bg-red-500/20, border-red-500 │
│  🟠 AMBER  │ bg-amber-500/20, border-amber │
│  🟢 GREEN  │ bg-green-500/20, border-green │
└────────────────────────────────────────────┘
```

---

## 4. UI Engineering & Layout Stability

### Flexbox Implementation: Cultural Sync List

The Cultural Sync List component employs precise CSS Flexbox constraints to ensure pixel-perfect alignment and prevent layout overflow issues.

#### Structural Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌──────────────────┐ ┌────────────────┐ ┌──────────────────┐   │
│ │  SENIOR PROFILE  │ │  SYNC GRAPHIC  │ │  JUNIOR PROFILE  │   │
│ │  (flex: 1)       │ │  (basis:120px) │ │  (flex: 1)       │   │
│ └──────────────────┘ └────────────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### CSS Constraints Applied

**Card Layout:**
```css
.pairing-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;           /* p-5 in Tailwind */
  overflow: hidden;
  position: relative;
}
```

**Profile Sections:**
```css
.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;                  /* gap-3 in Tailwind */
  flex: 1;
  min-width: 0;               /* Enables text truncation */
}
```

**Avatar Constraint:**
```css
.avatar-circle {
  flex-shrink: 0;             /* Prevents squishing */
  width: 40px;                /* h-10 w-10 in Tailwind */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
```

**Center Sync Graphic:**
```css
.sync-graphic {
  flex: 0 0 120px;            /* Fixed width buffer zone */
  text-align: center;
}
```

**Text Handling:**
```css
.truncated-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**List Container:**
```css
.sync-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;                  /* gap-4 in Tailwind */
}
```

#### Tailwind Implementation

```tsx
// Pairing Card
<div className="flex items-center justify-between rounded-lg border bg-card p-5 overflow-hidden relative">
  
  {/* Senior Profile */}
  <div className="flex items-center gap-3 flex-1 min-w-0">
    <Avatar className="flex-shrink-0 h-10 w-10">...</Avatar>
    <div className="min-w-0 overflow-hidden">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {senior.name}
      </p>
    </div>
  </div>

  {/* Sync Graphic Center Buffer */}
  <div className="flex-shrink-0 flex-grow-0 basis-[120px] text-center">
    <Badge>{connectionScore}%</Badge>
  </div>

  {/* Junior Profile */}
  <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">...</div>
</div>
```

### Responsive Radar Charts: Chart.js Integration

The Skill Radar Chart implements Chart.js with react-chartjs-2 for real-time visualization of employee competency profiles.

#### Configuration

```typescript
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
```

#### Chart Options

```typescript
const options: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      angleLines: { color: "rgba(255,255,255,0.1)" },
      grid: { color: "rgba(255,255,255,0.1)" },
      pointLabels: {
        color: "hsl(var(--foreground))",
        font: { size: 12 },
      },
      ticks: {
        display: false,
        stepSize: 2,
      },
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  plugins: {
    legend: { display: false },
  },
};
```

#### Data Structure

```typescript
const data: ChartData<"radar"> = {
  labels: Object.keys(employee.skills),
  datasets: [
    {
      label: "Skill Level",
      data: Object.values(employee.skills),
      backgroundColor: "rgba(59, 130, 246, 0.3)",  // Electric Blue fill
      borderColor: "rgb(59, 130, 246)",            // Electric Blue border
      borderWidth: 2,
      pointBackgroundColor: "rgb(59, 130, 246)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(59, 130, 246)",
    },
  ],
};
```

---

## 5. Integration & Scalability

### API Endpoints

#### Employee Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | Retrieve all employees with full skill profiles |
| `GET` | `/api/employees/:id` | Retrieve single employee by UUID |
| `PATCH` | `/api/employees/:id` | Update employee profile (skills, level, goals) |

#### Request/Response Examples

**GET /api/employees**
```json
// Response
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Robert",
    "department": "Legacy Ops",
    "tenure": 18,
    "level": 3,
    "skills": { "Mechanical": 9, "Precision": 9, "IoT": 2 },
    "risk": "Underutilized",
    "digitalLiteracy": 2,
    "careerGoals": ""
  }
]
```

**PATCH /api/employees/:id (Update Profile)**
```json
// Request Body
{
  "skills": { "Mechanical": 9, "Precision": 9, "IoT": 5 },
  "level": 5,
  "digitalLiteracy": 4,
  "careerGoals": "Transition to hybrid automation role"
}

// Response
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Robert",
  "department": "Legacy Ops",
  "tenure": 18,
  "level": 5,
  "skills": { "Mechanical": 9, "Precision": 9, "IoT": 5 },
  "risk": "Underutilized",
  "digitalLiteracy": 4,
  "careerGoals": "Transition to hybrid automation role"
}
```

### Future Scope: Silo-Breaker Expansion

The current Silo-Breaker implementation enables cross-departmental skill discovery within a single organization. The architecture supports expansion to **global cross-subsidiary talent sharing**.

#### Current Implementation

```typescript
// Search employees by skill across departments
const results = employees.filter(employee => {
  const skills = employee.skills as Record<string, number>;
  return Object.keys(skills).some(
    skill => skill.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
```

#### Proposed Multi-Subsidiary Architecture

```
                    ┌─────────────────────────────────────┐
                    │        GLOBAL TALENT HUB            │
                    │    (Federated Search Gateway)       │
                    └───────────────┬─────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────▼───────┐         ┌─────────▼─────────┐       ┌─────────▼─────────┐
│  SUBSIDIARY A  │         │   SUBSIDIARY B    │       │   SUBSIDIARY C    │
│   Americas     │         │      EMEA         │       │      APAC         │
│  PostgreSQL    │         │    PostgreSQL     │       │    PostgreSQL     │
└────────────────┘         └───────────────────┘       └───────────────────┘
```

#### Future API Design

```typescript
// Proposed global search endpoint
GET /api/global/talent-search
  ?skill=Python
  &minLevel=7
  &subsidiaries=AMERICAS,EMEA
  &availability=transfer|secondment|collaboration

// Response
{
  "results": [
    {
      "employee": { ... },
      "subsidiary": "AMERICAS",
      "transferEligibility": "immediate",
      "secondmentCost": 45000
    }
  ],
  "aggregations": {
    "bySubsidiary": { "AMERICAS": 12, "EMEA": 8 },
    "byDepartment": { "Engineering": 15, "Data Science": 5 }
  }
}
```

#### Implementation Roadmap

1. **Phase 1:** Multi-tenant database schema with subsidiary isolation
2. **Phase 2:** Federated search API with cross-database queries
3. **Phase 3:** Transfer eligibility rules engine
4. **Phase 4:** Compliance integration (visa, labor law, tax implications)
5. **Phase 5:** AI-powered global mentorship matching

---

## Appendix: Design System Reference

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | Navy Blue (#0A192F) | Navy Blue | Primary background |
| `--accent` | Electric Blue (#3B82F6) | Electric Blue | Interactive elements |
| `--foreground` | White | White | Primary text |
| `--muted-foreground` | Gray-400 | Gray-500 | Secondary text |
| `--card` | Elevated Navy | Elevated Navy | Card backgrounds |
| `--destructive` | Red-500 | Red-500 | Error states |

### Typography Scale

| Size | Tailwind | Usage |
|------|----------|-------|
| xs | `text-xs` | Badges, labels |
| sm | `text-sm` | Body text, descriptions |
| base | `text-base` | Default body |
| lg | `text-lg` | Card titles |
| xl | `text-xl` | Section headers |
| 2xl | `text-2xl` | Page titles |

---

*Document generated for BridgeVantage v1.0.0*  
*For internal engineering reference only*
