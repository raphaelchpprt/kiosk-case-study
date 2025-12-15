# Kiosk – Full-stack Case Study

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Getting started

### With Docker (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Without Docker (development mode)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## How the app works

### User Journey

1. **Landing Screen**: Users are presented with two options:
   - Upload a custom CSV file with questions
   - Start with the default form (using `questions.csv`)

2. **Form Navigation**: Once started, the application:
   - Displays a **sidebar navigation** showing all sections and questions organized hierarchically
   - Shows questions **one at a time** in the main area with a sequential navigation flow
   - Uses a **color-coded status system**:
     - Blue = current question
     - Teal = completed (answered)
     - Yellow = visited but not answered
     - Gray = not yet visited (non-clickable)
   - Displays a **progress bar** at the top showing overall completion

3. **Answering Questions**: Users can:
   - Navigate sequentially using "OK" button or Prev/Next buttons
   - Jump directly to any previously visited question via the sidebar
   - See the parent section name as breadcrumb context above each question
   - Input answers based on question type (text, number, or select dropdown)

4. **Completion**: On the last question, the "OK" button changes to "Finish" and displays all collected answers (currently as a JSON alert, would be improved with a proper summary screen)

### Technical Architecture

**Backend (Express + TypeScript)**
- **Repository Pattern**: Designed for database-readiness with (currently using CSV, but possibly swappable with Prisma/PostgreSQL)
- **CSV Parser**: Transforms flat CSV data into a hierarchical tree structure (N-level depth support)
- **REST API**: Exposes `/api/questions` endpoint serving the complete question tree and `/api/upload` for custom CSV uploads
- **Validation**: Server-side validation of CSV structure with detailed error reporting

**Frontend (Next.js + Mantine UI)**
- **Next.js**: Chosen for its proximity to Remix (production stack), its modern build experience (similar to Vite), and personal familiarity with the framework
- **Mantine UI**: Selected for its comprehensive component library (proximity with MaterialUi) and visual consistency (plus aligns with production stack requirements)
- **Dual Data Representation**:
  - Tree structure: Preserves hierarchy for sidebar navigation
  - Flattened list: Simplifies sequential navigation (prev/next logic)
- **State Management**: React hooks for current position, max visited index, and answer collection

**Communication Flow**
1. Backend parses CSV → builds tree → validates structure
2. Frontend fetches tree via `/api/questions` 
3. Frontend derives both hierarchical (sidebar) and flat (navigation) representations
4. User answers stored in frontend state (ready for POST endpoint implementation)

**UX Design Rationale**
- **Left Sidebar Navigation**: Provides constant visibility of all sections and questions, allowing users to:
  - Quickly identify incomplete or skipped questions (yellow status)
  - Jump back to any previously visited question for review
  - Understand their overall progress at a glance
- **One Question at a Time**: Reduces cognitive load and maintains focus, especially important for lengthy forms
- **Color-Coded Status**: Visual feedback system helps users track completed, visited, and pending questions without additional mental effort

## AI usage

GitHub Copilot Chat :

- Generating initial boilerplate and project structure setup
- Explaining and comparing technical choices (Repository pattern for db ready)
- Reviewing code structure (sometimes) and suggesting improvements
- Troubleshooting Docker configuration issues
- Drafting names of the commits
- Mantine Ui components
- Test redaction
- Drafting readme

AI provided explanations, comparisons, and recommendations but did not generate final implementation code directly. All implementation code was written manually and I made all architectural decisions.

## What would be improved next

### Architecture
- Move shared types to a monorepo `shared/` package for end-to-end type safety thanks to single source of truth

### Frontend
- Add more solid form validations with React Hook Form + Zod with user-friendly visual feedback messages for required fields and validation errors
- Handle scalability for large question sets and large answers
- Homogenize styling approaches (CSS modules, inline styles, and Mantine style overrides) for better consistency and team collaboration
- Add unit tests

### UX
- Improve Ui : loading states and skeleton screens during data fetching for example
- Add more keyboard navigation (arrows for navigation)
- Implement hierarchical stepper with indentation and more explicit breadcrumbs if CSV structure exceeds 2 levels in the future for deeply nested questions (currently limited to 2 levels as per CSV structure, but backend supports N levels)
- Improve progress line, too passive for now (add colors corresponding to complete or incomplete sections or questions)
- Drag and drop for data file upload

### Product
- Implement proper summary/results final screen with table and maybe export functionality
- Auto-save draft answers at each step to prevent data loss if user doesn't have time to complete the questionnaire and allow them to resume where they left off (global state, local storage or save in database)
- Dynamic rows (see data model section)

### Backend
- Add unit tests (Jest) for parsers, builders, and validators
- Implement persistent storage in db
- Handle scalability for large datasets for CSV and database (query optimization)
- Handle other formats of data files (Json, xcel files)

### DevOps
- Add CI/CD pipeline (GitHub Actions) with automated tests and builds
- Configure environment-specific Docker builds (dev/staging/prod)

### Data Model
- Support dynamic rows for questions like "Employees by country": currently only one input per question, but logically should allow adding/removing/editing multiple rows (one per country). Implementation would require:
  - A country selector (either from database dictionary or external API, though API would be more resource-intensive)
  - CRUD operations for row management
  - Updated question type (e.g., 'repeatable' or 'table-row')
- Conditional question visibility based on previous answers if needed

---

Welcome, and thank you for your interest in Kiosk 👋  

This exercise is a **technical case study for a Full-stack** position.  
It is inspired by a real feature of our ESG/CSRD reporting product.

We are **not** looking for a “finished product at all costs”.  
We explicitly **prioritise quality over quantity**:
- clear architecture and trade-offs
- readable, maintainable code
- sensible UX
- ability to explain your decisions

It is **absolutely fine if you don’t implement everything**.  
If you run out of time, please document what you would do next.


## 1. Goal of the exercise

We want to simulate a small slice of the Kiosk product:

Given a catalog of questions stored in a CSV file, load and transform this data on the server, assemble it into a hierarchical structure, expose it to the frontend, and build a dynamic form experience that captures user answers.

A question may have related questions, which themselves can have related questions, and so on.
Your job is to interpret this structure and design a coherent way to model it, render it, and collect answers.

It is totally OK to not implement everything; focus on clarity, structure, and trade-offs.


## 2. Tech stack & constraints

For information, our production stack is:

- **Node.js**
- **Remix**
- **TypeScript**
- **Mantine UI**
- **Prisma + PostgreSQL**

For this case study, please use:
- **React**
- **TypeScript**

You are free to use any libraries, tooling, framework etc you prefer
We intentionally keep the constraints minimal so you can choose the architecture and tools that make the most sense to you.

## 3. Deliverables

Please send us:
1. A link to your repository (GitHub, GitLab, etc.)
2. This README filled in with:
    - how to run the project
    - if you used AI, how you used it
    - what you would improve next
3. A simple Docker setup (e.g. Dockerfile or docker-compose) to run the app end-to-end

## 4. Structure of questions.csv

The file `questions.csv` contains the sample list of datapoints.

Here are the columns:
- id
- question label en / question label fr
- content
    - defines the expected input type for this question.
    - possible values:
        - "number" → numeric value
        - "text" → free-text input
        - "enum" → selectable value from a list
        - "table" → multi-row / multi-field structure (you may simplify this for the exercise)
        - "" (empty) → this question does not expect a content, it is usually the title of another question
- related question id
    - if present, this question is logically linked to another question.
    - typical use cases:
        - table rows
        - hierarchical visibility (nested follow-up questions)
- order
    - suggested position of the question within its group.
- unit
    - indicates a measurement unit (e.g. %, €, hours).
- enum fr / enum en
    - Applies only when content = "enum".
    - Contain semicolon-separated lists of possible values in French or English.


### Example:

| id   | question label en         | content | related question id  |
|------|---------------------------|---------|----------------------|
| Q100 | Employee details          | table   |                      |
| Q101 | Employee birth year       | number  | Q100                 |

Here:
- Q100 defines a table section.
- Q101 is a row/field of that table because it references Q100.

Example of how it could be rendered:

| Employee details   | Value      |
|--------------------|------------|
| Employee details   |            |


## Questions about this case study

If anything is unclear, feel free to email `sabine@meetkiosk.com` or `mathys@meetkiosk.com`.
