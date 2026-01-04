# BridgeVantage Design Guidelines

## Design Approach
**System-Based Design** using **Material Design** principles adapted for enterprise SaaS, drawing inspiration from Linear's clean interface and Notion's information hierarchy. This approach prioritizes data clarity, efficient workflows, and seamless role-switching.

## Core Design Principles
1. **Data-First Clarity**: Every visualization must communicate insights instantly
2. **Role Context**: Visual cues distinguish Employee vs Manager views
3. **Real-Time Fluidity**: State changes feel immediate and connected
4. **Professional Trust**: Clean, confident aesthetic that conveys enterprise reliability

---

## Typography

**Font Stack**: Inter (via Google Fonts CDN)
- **Display/Headers**: 600 weight, 32px-24px (responsive scaling)
- **Section Titles**: 600 weight, 20px
- **Body Text**: 400 weight, 16px, 1.6 line-height
- **Labels/Meta**: 500 weight, 14px, uppercase with letter-spacing 0.5px
- **Data Points**: 600 weight, 18px (numbers in charts/stats)

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16**
- Component padding: p-6 or p-8
- Section gaps: gap-8 or gap-12
- Card spacing: space-y-6
- Grid gaps: gap-6

**Grid Structure**:
- Sidebar: Fixed 280px width
- Main content: max-w-7xl with px-8
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Heatmap grid: 5 columns for 10 employees (2 rows)

---

## Component Library

### Navigation
**Fixed Sidebar** (280px):
- Logo at top (h-16)
- Navigation items with left accent bar on active state
- Role switcher at bottom of sidebar
- Use Heroicons for nav icons

**Top Header**:
- Breadcrumb trail on left
- Role toggle buttons on right with distinctive styling
- Height: h-16

### Role Switcher
**Two-Button Toggle** (top-right corner):
- "[View as Employee: Robert]" button
- "[View as Talent Manager]" button
- Active state: filled background, inactive: outline only
- Smooth transition between views (fade-in/fade-out 200ms)

### Dashboard Cards
**White Cards** with:
- Rounded corners: rounded-xl
- Shadow: shadow-lg with subtle border
- Padding: p-8
- Header with icon + title (mb-6)
- Content area with appropriate data visualization

### Data Visualizations

**Skill Radar Chart** (Employee View):
- Chart.js radar with 6-8 skill dimensions
- Navy fill with 20% opacity, Electric Blue stroke
- Labels positioned outside the polygon
- Card size: Occupies 2 columns in dashboard grid

**Retention Heatmap** (Manager View):
- 5x2 employee grid
- Each cell: 160px height with employee name, dept, level
- Color coding: Red (#EF4444), Amber (#F59E0B), Green (#10B981)
- Hover reveals detailed tooltip with all skills

**Match Score Display**:
- Percentage badge (0-100%)
- Progress ring visualization for visual scanning
- Small avatar + name + role below score

### Forms
**Profile Edit Form**:
- Label above input pattern
- Input fields: h-12 with border-2
- Focus state: Electric Blue border
- Save button: prominent, full-width on mobile

**Silo-Breaker Search**:
- Search bar: h-14 with icon prefix
- Real-time results dropdown with department tags
- Keyboard navigation support

### Lists & Tables
**Cultural Sync Pairing List**:
- Card-based layout showing senior-junior pairs
- Left side: Senior (with tenure badge)
- Center: Connection strength visualization (animated dots/line)
- Right side: Junior (with skills to learn)
- Each pairing card has subtle hover lift

**The Bridge Recommendations**:
- Vertical list of mentor cards
- Avatar + name + skills offered
- Match percentage badge
- "Request Mentorship" button per card

---

## Animations

**Minimal, Purposeful Animations**:
- View switching: 200ms fade transition
- Card hover: translate-y-1 (lift effect)
- Data updates: Subtle pulse on changed values
- Loading states: Skeleton screens, not spinners

---

## User-Specified Color Palette

- **Primary Navy**: #0A192F (backgrounds, headers, primary text)
- **Electric Blue**: Use for accents, CTAs, active states, data highlights
- **White**: #FFFFFF for cards and contrast areas
- **Card shadows**: Soft, subtle (shadow-lg equivalent)

---

## View-Specific Layouts

### Employee View (Robert)
**3-Column Dashboard**:
1. **Left**: Skill Radar Chart (spans 2 columns)
2. **Right**: Quick Stats card (tenure, level, dept)
3. **Full Width**: "The Bridge" mentorship recommendations (grid-cols-1 lg:grid-cols-2)
4. **Bottom**: Edit Profile form in expandable panel

### Talent Manager View
**Dashboard Sections** (vertical flow):
1. **Top Stats Bar**: 4 metric cards (grid-cols-4) - Total employees, At-risk count, Active pairings, Avg skill level
2. **Retention Heatmap**: Full-width card with 5x2 grid
3. **Two Columns Below**:
   - Left: Top 3 Cultural Sync pairings
   - Right: Silo-Breaker search with results
4. **Bottom**: Department skill distribution chart

---

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for role switcher and search
- High contrast maintained across all visualizations
- Focus indicators: 2px Electric Blue outline

---

## Icon Library
**Heroicons** (outline style) via CDN for all interface icons