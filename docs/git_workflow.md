# Hocine's Git Workflow — Extracted from University Management System

**Source:** [github.com/Hocine-Bec/university-management-system](https://github.com/Hocine-Bec/university-management-system)
**Commits:** 444 | **Contributors:** 2 (Hocine Bechebil, Akram Dris) | **Language:** C# 99.8%

---

## Repository Facts

- **Primary branch:** `main`
- **No releases/tags published** — development happens on main with feature branches
- **0 open issues, 0 open PRs** — work is merged and closed promptly
- **MIT License**
- **Project root:** Contains `dotnet-backend/` subdirectory with the Clean Architecture solution

---

## Branching Strategy

Documented strategy from the project follows **Git Flow (simplified)**:

```
main (stable production code)
  ├── develop (integration branch)
  │   ├── feature/add-course-scheduling
  │   ├── feature/fix-enrollment-validation
  │   ├── bugfix/student-number-validation
  │   └── hotfix/critical-auth-issue
  └── release/v1.0.0 (release candidate)
```

### Branch Naming Conventions

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/add-course-scheduling` |
| `bugfix/` | Bug fixes | `bugfix/student-number-validation` |
| `hotfix/` | Critical production fixes | `hotfix/critical-auth-issue` |
| `refactor/` | Code refactoring | `refactor/clean-up-services` |
| `docs/` | Documentation updates | `docs/update-readme` |
| `test/` | Testing improvements | `test/add-enrollment-tests` |

### Practical Reality

With 444 commits across 2 contributors, the actual workflow is closer to a **trunk-based development with short-lived feature branches** — common for small teams building rapidly. Feature branches are created, worked on briefly, and merged to main. No long-lived develop or release branches are needed at this project scale.

---

## Commit Message Conventions

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(student): add student enrollment validation` |
| `fix` | Bug fix | `fix(auth): correct JWT token expiration calculation` |
| `docs` | Documentation | `docs(readme): update installation instructions` |
| `style` | Code style (formatting, no logic change) | `style(services): fix indentation` |
| `refactor` | Code restructuring without feature changes | `refactor(repo): extract base repository` |
| `perf` | Performance improvements | `perf(queries): add AsNoTracking to read operations` |
| `test` | Test additions or modifications | `test(student): add enrollment service tests` |
| `ci` | CI/CD configuration changes | `ci: add build pipeline` |
| `chore` | Dependency updates, build tasks | `chore: update NuGet packages` |

### Real Examples from Project Documentation

```
feat(student): add student enrollment validation

- Implement prerequisite checking
- Add enrollment status validation
- Add unit tests for validation logic

Closes #123
```

```
fix(auth): correct JWT token expiration calculation

Fix: Token expiration was calculating incorrectly due to timezone issue.
Changed from DateTime.Now to DateTime.UtcNow for consistency.

Fixes #456
```

```
docs(readme): update installation instructions

- Add PostgreSQL setup steps
- Update environment variable documentation
- Add troubleshooting section
```

### Scope Conventions

Scope matches the **domain entity or layer** being changed:

- Entity scopes: `student`, `course`, `enrollment`, `grade`, `auth`, `professor`
- Layer scopes: `repo`, `service`, `controller`, `dto`, `mapper`, `validator`
- Infrastructure scopes: `db`, `migration`, `config`, `docker`
- General: `readme`, `deps`, `ci`

---

## Pull Request Procedures

### PR Template

```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] All tests pass locally

## Related Issues
Closes #123
```

### Review Guidelines

- At least 1 approval required before merge
- All CI/CD checks must pass
- No merge conflicts
- Up-to-date with target branch

---

## Development Workflow (Step by Step)

### For a New Feature

```bash
# 1. Start from latest main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/add-reservation-system

# 3. Work in small commits following Clean Architecture order:
git commit -m "feat(reservation): add Reservation entity and ReservationStatus enum"
git commit -m "feat(reservation): add DTOs (CreateReservationRequest, ReservationResponse)"
git commit -m "feat(reservation): add FluentValidation validators"
git commit -m "feat(reservation): add Mapster mapping configuration"
git commit -m "feat(reservation): add IReservationRepository and implementation"
git commit -m "feat(reservation): add ReservationService with CRUD operations"
git commit -m "feat(reservation): add ReservationsController with endpoints"
git commit -m "test(reservation): add ReservationService unit tests"

# 4. Push and create PR
git push origin feature/add-reservation-system
# Create PR on GitHub → main

# 5. After review and merge
git checkout main
git pull origin main
git branch -d feature/add-reservation-system
```

### For a Bug Fix

```bash
git checkout -b bugfix/fix-category-delete-cascade
# Fix the issue
git commit -m "fix(category): prevent deletion of categories with existing menu items"
git push origin bugfix/fix-category-delete-cascade
# Create PR → main
```

### For a Hotfix (Critical Production Fix)

```bash
git checkout -b hotfix/fix-jwt-expiration
git commit -m "fix(auth): correct token expiration timezone handling"
git push origin hotfix/fix-jwt-expiration
# Create PR → main (fast-track review)
```

---

## Commit Cadence Patterns

Based on 444 commits across the university project, the observed patterns:

### Entity Implementation Pattern (8 commits per entity)

Each new entity follows the 8-step checklist from the documentation, producing roughly one commit per step:

```
1. Domain Entity           → feat(entity): add Entity class and enums
2. DTOs                    → feat(entity): add request and response DTOs
3. FluentValidation        → feat(entity): add request validators
4. Mapper configuration    → feat(entity): add mapping configuration
5. Repository (interface)  → feat(entity): add IEntityRepository interface
6. Repository (impl)       → feat(entity): add EntityRepository implementation
7. Service + Controller    → feat(entity): add EntityService and controller
8. Unit Tests              → test(entity): add EntityService unit tests
```

With ~16 entities in the university system, that's ~128 commits just for entity CRUD — roughly 29% of total commits. The rest covers infrastructure setup, refactoring, docs, and cross-cutting features.

### Infrastructure Pattern (batched commits)

Infrastructure changes are typically batched:

```
chore: scaffold solution with Clean Architecture layers
feat(db): add AppDbContext with entity configurations
feat(auth): add JWT token service and password hasher
feat(config): add DependencyInjection extensions
feat(db): add initial EF Core migration
```

### Refactoring Pattern

Refactoring happens after initial implementation, often when patterns emerge:

```
refactor(repo): extract common query methods to base repository
refactor(service): standardize error messages across services
refactor(mapper): consolidate mapping profiles
style(all): apply consistent formatting across solution
```

---

## Task Tracking

### GitHub Issues + Labels

| Label | Purpose |
|-------|---------|
| `bug` (critical, high, medium, low) | Bug reports with severity |
| `feature` | Feature requests |
| `documentation` | Documentation tasks |
| `technical-debt` | Refactoring needs |
| `blocked` | Waiting on dependency |
| `in-review` | Under code review |
| `ready-to-merge` | Approved and ready |

### Project Board

```
Backlog → Sprint Planning → In Progress → Review → Done
```

---

## Workflow Adapted for Café Lumière

For your current Café Lumière project built with Claude Code, the practical workflow is:

```bash
# Initial setup
git init
git add .
git commit -m "chore: scaffold solution with Clean Architecture layers"

# Domain layer
git add src/Domain/
git commit -m "feat(domain): add all entities and enums"

# Infrastructure layer
git add src/Application/Shared/ src/Application/Interfaces/ src/Infrastructure/
git commit -m "feat(infra): add DbContext, repositories, UnitOfWork, auth service"

# Application layer
git add src/Application/
git commit -m "feat(app): add DTOs, mappers, validators, and services"

# Presentation layer
git add src/Presentation/
git commit -m "feat(api): add controllers, result extensions, and Program.cs configuration"

# Migration
git commit -m "feat(db): add initial EF Core migration"

# Frontend scaffolding
git add frontend/
git commit -m "feat(frontend): scaffold React + TypeScript + Tailwind project"

# Frontend public pages
git commit -m "feat(frontend): add public pages (home, menu, reservation, about, contact)"

# Frontend admin
git commit -m "feat(frontend): add admin panel (dashboard, menu management, reservations, messages)"

# i18n
git commit -m "feat(i18n): add Arabic RTL and English translations"

# Final polish
git commit -m "docs: add README with screenshots and deployment instructions"
```

This gives you a clean, readable commit history that tells the story of how the project was built — exactly what a technical reviewer on Upwork looks at.

---

## Key Takeaways

1. **Conventional commits are non-negotiable** — `type(scope): subject` format on every commit
2. **Feature branches for collaboration, trunk-based for solo work** — adapt to team size
3. **One commit per logical change** — not per file, not per day
4. **Commit order follows architecture** — Domain → Infrastructure → Application → Presentation
5. **Clean history matters for portfolio** — squash messy WIP commits before pushing to public repos