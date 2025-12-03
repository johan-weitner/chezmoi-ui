# Copilot Instructions for Chezmoi UI

## Project Overview

Chezmoi UI is a local web UI for managing application lists for Chezmoi installations. It's a full-stack JavaScript application built as a monorepo with separate client and server packages.

## Project Structure

This is a monorepo managed with **pnpm workspaces** and **TurboRepo**:

```
chezmoi-ui/
├── client/               # React frontend (Vite + Mantine UI)
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # React components
│   │   ├── core/        # Core business logic
│   │   ├── store/       # Redux store and selectors
│   │   └── utils/       # Utility functions
│   ├── public/
│   └── package.json
├── server/              # Node.js backend (Express + Prisma)
│   ├── src/
│   │   ├── core/       # Core server logic
│   │   ├── db/         # Database service layer
│   │   ├── routes/     # Express routes
│   │   └── util/       # Server utilities
│   ├── prisma/         # Prisma schema and migrations
│   └── package.json
├── scripts/            # Build and utility scripts
├── .github/            # GitHub configuration
└── package.json        # Root package.json (workspace config)
```

## Tech Stack

### Frontend (client/)
- **Framework**: React 18
- **UI Library**: Mantine UI v7
- **State Management**: Redux Toolkit with Reselect
- **Build Tool**: Vite
- **Testing**: Vitest with @testing-library/react
- **Linter**: Biome

### Backend (server/)
- **Runtime**: Node.js 20+
- **Framework**: Express
- **Database**: SQLite with Prisma ORM
- **Testing**: Vitest
- **Linter**: Biome

## Development Commands

### Root Level (from repository root)
- `pnpm start` - Start both client and server (detached)
- `pnpm stop` - Stop both client and server
- `pnpm lint` - Lint both client and server
- `pnpm lint:fix` - Auto-fix linting issues in both packages
- `pnpm installDeps` - Install dependencies for all workspaces

### Client (from client/ directory)
- `pnpm dev` - Start development server (port 8000)
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Auto-fix linting issues

### Server (from server/ directory)
- `pnpm start` - Start server (port 3000)
- `pnpm test` - Run tests
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Auto-fix linting issues

## Coding Standards

### General Rules
- Use ES modules (`type: "module"` in package.json)
- Use `pnpm` as the package manager (not npm)
- Follow the existing code style enforced by Biome
- Always run linter before committing: `pnpm lint`
- Write tests for new features (Vitest + testing-library)
- Use absolute paths when referencing files in the repository

### JavaScript/React Conventions
- Use modern JavaScript features (ES2020+)
- Prefer functional components with hooks
- Use Redux Toolkit for state management
- Use Reselect for memoized selectors
- Component files should use PascalCase naming
- Utility files should use camelCase naming
- Use Mantine UI components for UI elements
- Follow React Hooks rules

### File Organization
- Keep components small and focused
- Separate business logic from UI components (use core/ directory)
- API calls should go in api/ directory
- Shared utilities go in utils/ directory
- Store-related code (reducers, actions, selectors) in store/ directory

### Database & API
- Use Prisma for database operations (server/prisma/)
- Database schema is in `server/prisma/schema.prisma`
- API endpoints follow REST conventions
- Server runs on port 3000, client proxies to it during development

## Testing Guidelines

- Tests use Vitest as the test runner
- Frontend tests use @testing-library/react
- Test files should be co-located with the code they test
- Use `.spec.js` or `.test.js` suffix for test files
- Run tests with `pnpm test` in the relevant package
- Existing tests should not be removed unless absolutely necessary

### Test Examples
- API tests: `client/src/api/*.spec.js`
- Component tests: Look for existing patterns
- Service tests: `server/src/db/dbService.test.js`
- Utility tests: `client/src/utils/*.spec.js`, `server/src/util/*.spec.js`

## Important Constraints

### What to Avoid
- Don't modify existing tests unless fixing them is part of the task
- Don't add new dependencies without checking for vulnerabilities first
- Don't change the workspace structure (client/server separation)
- Don't modify database schema without considering migrations
- Don't commit secrets or environment variables (use .env.example as reference)
- Don't remove working code unless explicitly required
- Never commit files from `node_modules/`, `dist/`, or `.vite/`

### Build Artifacts to Exclude
The following are build artifacts and should be in .gitignore:
- `node_modules/`
- `dist/`
- `.vite/`
- `*.log`
- `.env` (only .env.example should be committed)

## Environment Setup

1. Clone the repository
2. Run `./setup.sh` (or `setup.bat` on Windows) to initialize
3. Review `.env.example` files in client/ and server/ directories
4. Copy to `.env` and adjust if needed
5. Run `pnpm installDeps` to install dependencies
6. Run `pnpm start` to start the application

## Docker Support

The project can also run in Docker:
```bash
docker-compose up
```
Database is persisted on a Docker volume.

## Key Features to Understand

- **Application Management**: CRUD operations for applications (name, description, URLs, installation methods)
- **Groups**: Applications can be organized into groups (Install.Doctor compatibility)
- **Tags**: Custom tagging system for filtering and categorization
- **YAML Export**: Export application lists in Chezmoi/Install.Doctor format
- **Search & Filters**: Multiple filter options for finding and organizing apps
- **Keyboard Shortcuts**: UI is optimized for keyboard navigation

## API Structure

The backend provides REST endpoints for:
- Applications: `/api/apps`
- Groups: `/api/groups`
- Tags: `/api/tags`
- Export: `/api/export`
- Filters: Various filter endpoints

Check `server/src/routes/` for detailed endpoint definitions.

## Common Tasks

### Adding a New Feature
1. Identify if it's client-side, server-side, or both
2. Write tests first (TDD approach preferred)
3. Implement minimal changes
4. Run linter: `pnpm lint:fix`
5. Run tests: `pnpm test`
6. Test manually by running the app
7. Commit changes

### Fixing a Bug
1. Write a failing test that reproduces the bug
2. Fix the bug with minimal changes
3. Ensure the test passes
4. Run full test suite
5. Run linter
6. Commit changes

### Updating Dependencies
1. Check for security vulnerabilities first
2. Update package.json
3. Run `pnpm install`
4. Test thoroughly
5. Update pnpm-lock.yaml

## Pull Request Guidelines

- Keep changes minimal and focused
- Run all tests before submitting
- Run linter and fix all issues
- Update documentation if needed
- Provide clear description of changes
- Reference any related issues

## Questions or Issues?

- Check existing code for patterns and conventions
- Refer to the main README.md for project background
- Review package.json files for available scripts
- Look at existing tests for testing patterns
