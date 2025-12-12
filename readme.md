# Kiosk – Full-stack Case Study

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

## AI usage

AI (GitHub Copilot Chat) was used as a guidance and architecture advisor throughout development:

- Generating initial boilerplate and project structure setup
- Explaining and comparing technical choices (Repository pattern v for db ready)
- Context engineering: documenting architecture decisions in ADR.md format
- Reviewing code structure (sometimes) and suggesting improvements
- Troubleshooting Docker configuration issues

AI provided explanations, comparisons, and recommendations but did not generate final implementation code directly. All implementation code was written manually and I made all architectural decisions.

## What would be improved next

### Architecture
- Move shared types to a monorepo `shared/` package for end-to-end type safety thanks to single source of truth

### Frontend / UX / Product
- Add more solid form validations with React Hook Form + Zod with user-friendly visual feedback messages for required fields and validation errors
- Add loading states and skeleton screens during data fetching
- Add keyboard navigation (Enter to submit, arrows for navigation, autofocus on inputs)
- Implement proper summary/results final screen with maybe export functionality
- Auto-save draft answers at each step to prevent data loss if user doesn't have time to complete the questionnaire
- Display full breadcrumb path for deeply nested questions (currently limited to 2 levels as per CSV structure, but backend supports N levels)
- Then implement hierarchical stepper with indentation if CSV structure exceeds 2 levels in the future
- Handle scalability for large question sets and large answers

### Backend
- Add unit tests (Jest) for parsers, builders, and validators
- Implement persistent storage in db
- Handle scalability for large datasets for CSV and database (query optimization)

### DevOps
- Add CI/CD pipeline (GitHub Actions) with automated tests and builds
- Configure environment-specific Docker builds (dev/staging/prod)

### Data Model
- Support dynamic rows for questions like "Employees by country": currently only one input per question, but logically should allow adding/removing/editing multiple rows (one per country). Implementation would require:
  - A country selector (either from database dictionary or external API, though API would be more resource-intensive)
  - CRUD operations for row management
  - Updated question type (e.g., 'repeatable' or 'table-row')
- Add conditional question visibility based on previous answers


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
