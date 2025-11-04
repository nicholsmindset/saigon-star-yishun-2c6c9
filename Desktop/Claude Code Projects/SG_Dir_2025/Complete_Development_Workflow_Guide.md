# Singapore Halal Directory: Complete Setup & Development Guide with All Tools

## Table of Contents
1. [Prerequisites & Tools](#prerequisites--tools)
2. [Development Environment Setup](#development-environment-setup)
3. [CLI Tools Reference](#cli-tools-reference)
4. [Local Development Workflow](#local-development-workflow)
5. [Database Management](#database-management)
6. [Version Control & Deployment](#version-control--deployment)
7. [CSS Processing & Theme Generation](#css-processing--theme-generation)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Tools

### Required Software
```bash
# Package Manager & Runtime
Node.js 18+ (https://nodejs.org/)
npm 9+ (comes with Node.js)

# Docker (for local Supabase)
Docker Desktop (https://www.docker.com/products/docker-desktop/)

# Version Control
Git (https://git-scm.com/)

# Code Editor
Visual Studio Code (https://code.visualstudio.com/)
```

### Required CLI Tools to Install

```bash
# 1. Supabase CLI (Database & Auth)
npm install -g supabase

# 2. GitHub CLI (Version Control & Deployment)
npm install -g gh
# OR on macOS: brew install gh
# OR on Windows: choco install gh

# 3. Netlify CLI (Deployment & Hosting)
npm install -g netlify-cli

# 4. Claude Code (AI Development)
npm install -g @anthropic-ai/claude-code

# 5. Playwright (Testing & CSS Processing)
npm install -D @playwright/test

# Verify all installations:
supabase --version
gh --version
netlify --version
claude --version
npx playwright --version
```

### Browser Driver for Playwright
```bash
# Install browser binaries (run once)
npx playwright install

# Verify installation
npx playwright --version
```

---

## Development Environment Setup

### Step 1: Clone the Boilerplate Repository

```bash
# Clone the repo
npx degit IncomeStreamSurfer/claude-code-saas-starter halal-directory
cd halal-directory

# Verify you're in correct directory
pwd  # Should show: .../halal-directory

# List contents
ls -la  # Should see: app/, lib/, supabase/, .env.example, etc.
```

### Step 2: Initialize Version Control with GitHub CLI

```bash
# Initialize git (if not already done)
git init

# Create GitHub repository (interactive)
gh repo create singapore-halal-directory --source=. --remote=origin --private

# Verify connection
git remote -v  # Should show: origin https://github.com/[username]/singapore-halal-directory.git

# Make initial commit
git add .
git commit -m "Initial commit: boilerplate setup"
git push -u origin main
```

### Step 3: Start Supabase Locally with Docker

```bash
# Make sure Docker Desktop is running first!

# Initialize Supabase project
supabase init

# Verify initialization
ls -la supabase/  # Should see: config.toml, migrations/ folder

# Start local Supabase (includes database, auth, storage)
supabase start

# This will:
# ✓ Pull Docker images
# ✓ Start PostgreSQL database
# ✓ Start Supabase services
# ✓ Display URLs and credentials

# Expected output:
# API URL: http://localhost:54321
# GraphQL URL: http://localhost:54321/graphql/v1
# S3 Storage URL: http://localhost:54321/storage/v1
# Anon key: [LONG_KEY]
# Service role key: [LONG_KEY]

# IMPORTANT: Copy these credentials to .env.local
```

### Step 4: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env
cp .env.example .env.local

# Edit .env with your Supabase credentials
nano .env
# OR use your editor:
code .env

# Fill in the following (from supabase start output):
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=[from output]
# SUPABASE_SERVICE_ROLE_KEY=[from output]
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# For Netlify deployment (later):
# NETLIFY_SITE_ID=[will get from netlify]
# NETLIFY_AUTH_TOKEN=[will get from netlify]
```

### Step 5: Install Dependencies & Start Claude Code

```bash
# Install npm packages
npm install

# Verify installation
npm list | head -20  # Should see React, Next.js, Tailwind, etc.

# Start Claude Code with permissions
claude --dangerously-skip-permissions

# In Claude Code terminal, run:
/setup-boilerplate

# This will:
# ✓ Start Supabase instance
# ✓ Create environment files
# ✓ Set up Stripe (if configured)
# ✓ Configure webhooks
```

### Step 6: Start Development Server

```bash
# In a new terminal (keep Claude Code running):
npm run dev

# Expected output:
# ▲ Next.js 16.0.0
# - Local: http://localhost:3000
# - Environments: .env.local

# Open browser and navigate to http://localhost:3000
```

### Step 7: Verify Setup

```bash
# Check all systems
echo "=== Git Status ===" && git status
echo "=== Docker Containers ===" && docker ps
echo "=== Supabase Status ===" && supabase status
echo "=== Next.js Running ===" && curl http://localhost:3000

# Should see: all systems operational
```

---

## CLI Tools Reference

### Supabase CLI

```bash
# Start local development environment
supabase start

# Stop local environment (preserves data)
supabase stop

# Reset database (DESTRUCTIVE - removes all data)
supabase reset

# Check status of services
supabase status

# View logs from services
supabase logs --local

# Create a new migration
supabase migration new [migration_name]
# Example:
supabase migration new add_businesses_table

# Apply migrations to local database
supabase db push

# Pull migrations from production (after deployment)
supabase db pull

# Link to production project
supabase link --project-ref your-project-ref

# Deploy migrations to production
supabase db push --remote

# View database status
supabase db status

# Generate TypeScript types from database schema
supabase gen types typescript --local > types/database.ts
```

### GitHub CLI

```bash
# Authentication
gh auth login
# Follow prompts to authenticate

# Create issues from CLI
gh issue create --title "Add featured listings" --body "Implement featured listing feature"

# List your issues
gh issue list

# View specific issue
gh issue view 1

# Create pull requests
git push origin feature-branch
gh pr create --title "Add featured listings" --body "Implements featured listing system"

# View pull requests
gh pr list

# Check PR status
gh pr status

# Merge PR locally
gh pr merge 1 --squash

# View repository info
gh repo view

# Clone repository
gh repo clone username/repo

# Set repo visibility
gh repo edit --visibility private
```

### Netlify CLI

```bash
# Authenticate with Netlify
netlify login
# Opens browser for authentication

# Connect project to Netlify
netlify init
# Follow prompts to create/select site

# Deploy to Netlify
netlify deploy

# Deploy to production
netlify deploy --prod

# View site details
netlify sites:list

# Check deployment status
netlify status

# View environment variables
netlify env:list

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"

# View logs
netlify functions:logs

# Link local project to existing Netlify site
netlify link --id [your-site-id]
```

### Docker CLI

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View images
docker images

# Stop container
docker stop [container-id]

# Start container
docker start [container-id]

# View logs
docker logs [container-id]
docker logs -f [container-id]  # Follow logs

# Remove container
docker rm [container-id]

# Remove image
docker rmi [image-id]

# Cleanup unused resources
docker system prune

# View resource usage
docker stats
```

### Playwright CLI

```bash
# Install browsers (one-time)
npx playwright install

# Run tests
npx playwright test

# Run tests in UI mode (visual)
npx playwright test --ui

# Run specific test file
npx playwright test tests/business-detail.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Debug tests
npx playwright test --debug

# Generate test report
npx playwright show-report

# Codegen - auto-generate tests by recording actions
npx playwright codegen http://localhost:3000

# Take screenshot of URL
npx playwright screenshot page.png http://localhost:3000

# Extract CSS from website
npx playwright launch
# Then use Playwright Inspector to extract CSS
```

---

## Local Development Workflow

### Daily Development Workflow

```bash
# 1. Start your day - ensure all services running
docker ps  # Verify Docker running
supabase status  # Check Supabase
npm run dev  # Start Next.js

# 2. Create feature branch
git checkout -b feature/featured-listings

# 3. Work on feature with Claude Code
claude --dangerously-skip-permissions

# In Claude Code:
/setup-boilerplate  # If needed
# Then work on features

# 4. Test your changes
npm run build  # Build project
npm run lint  # Lint code

# 5. Use Playwright to test UI changes
npx playwright codegen http://localhost:3000
# This opens Playwright Inspector - click through your changes
# Playwright records your actions

# 6. Commit changes
git add .
git commit -m "feat: add featured listing support"

# 7. Push to GitHub
git push origin feature/featured-listings

# 8. Create PR on GitHub
gh pr create --title "Add featured listings" --body "Implementation of featured listings with..."

# 9. Request review
gh pr view  # Check PR status

# 10. Merge when approved
gh pr merge --squash

# 11. Deploy locally for testing
netlify deploy

# 12. Deploy to production
netlify deploy --prod
```

### Using Playwright for Testing CSS & Theme

```bash
# 1. Extract CSS from Clay.com (the reference site)
npx playwright codegen https://www.clay.com

# 2. In Playwright Inspector:
#    - Right-click element
#    - Inspect to see CSS
#    - Copy element structure
#    - Playwright records all actions

# 3. Create test file for your theme
npx playwright test --codegen

# 4. Run visual tests
npx playwright test --headed

# 5. Update CSS based on screenshots
# Edit app/globals.css with new Tailwind configuration

# 6. Re-run tests to verify
npx playwright test
```

### Database Management During Development

```bash
# Create new migration for schema changes
supabase migration new add_featured_listings_table

# Edit the migration file:
nano supabase/migrations/20250115_add_featured_listings_table.sql

# Apply migration locally
supabase db push

# Verify changes
supabase db status

# Generate updated TypeScript types
supabase gen types typescript --local > types/database.ts

# Check git diff for type changes
git diff types/database.ts

# Commit migration and types
git add supabase/migrations types/database.ts
git commit -m "migration: add featured listings table"
```

---

## Database Management

### Creating & Managing Migrations

```bash
# 1. Create new migration with descriptive name
supabase migration new create_featured_listings

# 2. Edit migration file
cat supabase/migrations/20250115_create_featured_listings.sql

# Add SQL for your changes:
CREATE TABLE featured_listings (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id),
  stripe_payment_id TEXT,
  duration_days INTEGER,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_featured_listings_business_id ON featured_listings(business_id);
CREATE INDEX idx_featured_listings_expires_at ON featured_listings(expires_at);

# 3. Apply migration
supabase db push

# 4. Verify
supabase db status

# 5. Generate types
supabase gen types typescript --local > types/database.ts

# 6. Commit
git add supabase/migrations/ types/database.ts
git commit -m "migration: add featured_listings table with indexes"
```

### Seeding Database with Test Data

```bash
# Create seed file
nano supabase/seed.sql

# Add sample data:
INSERT INTO businesses (id, name, area_id, business_type, phone, address, postal_code)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Test Restaurant', 'area-id', 'restaurant', '02-1234-5678', '123 Main St', '560123'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Test Cafe', 'area-id', 'cafe', '02-2345-6789', '45 Side Lane', '560124');

# Apply seed
supabase db reset  # DESTRUCTIVE - resets everything and runs seed

# Verify
psql postgresql://postgres:postgres@localhost:5432/postgres -c "SELECT * FROM businesses LIMIT 5;"
```

### Backing Up & Restoring Data

```bash
# Backup local database
supabase db dump --file backup.sql

# Backup production database
supabase db dump --remote --file backup-prod.sql

# Restore from backup
supabase db push < backup.sql

# Check backup size
du -h backup.sql

# List all backups
ls -la backup*.sql
```

---

## Version Control & Deployment

### Git Workflow

```bash
# Check current branch
git branch

# Create new feature branch
git checkout -b feature/add-featured-listings

# Make changes, then stage them
git add .

# Check what's staged
git status

# Commit with detailed message
git commit -m "feat: implement featured listing upgrade system

- Add featured_listings table to database
- Create upgrade page component
- Integrate Stripe checkout
- Add featured badge to business cards
- Update area page to sort featured first"

# View commit log
git log --oneline -10

# Push to GitHub
git push origin feature/add-featured-listings

# Create pull request via CLI
gh pr create --title "Add featured listing system" \
  --body "This PR implements the full featured listing system including database schema, UI components, and Stripe integration."

# View PR
gh pr view

# Update PR after feedback
git add .
git commit -m "fix: update featured listing styling"
git push origin feature/add-featured-listings

# Merge PR
gh pr merge --squash

# Delete local branch
git branch -d feature/add-featured-listings

# Delete remote branch
git push origin --delete feature/add-featured-listings

# Keep main updated
git checkout main
git pull origin main
```

### Environment-Specific Workflows

```bash
# Development (local)
npm run dev

# Staging (test deployment)
netlify deploy

# Production (live)
netlify deploy --prod

# Check deployment status
netlify status

# View logs for troubleshooting
netlify functions:logs

# Rollback if needed
netlify deploy --prod  # Deploys previous version automatically
```

---

## CSS Processing & Theme Generation

### Using Playwright to Extract & Adapt CSS

```bash
# 1. Start Playwright Inspector on reference site
npx playwright codegen https://www.clay.com

# 2. In Playwright Inspector:
#    - Inspect elements you want to replicate
#    - Use DevTools to copy CSS
#    - Take screenshots of key components

# 3. Create custom theme file
nano app/custom-theme.css

# 4. Extract and adapt CSS for your halal directory theme
# Example Tailwind config:
# module.exports = {
#   theme: {
#     colors: {
#       halal: '#10b981',     // Green for halal
#       featured: '#3b82f6',  // Blue for featured
#       certified: '#fbbf24'  // Gold for certified
#     }
#   }
# }

# 5. Update globals.css
echo "@import './custom-theme.css';" >> app/globals.css

# 6. Test with Playwright
npx playwright test --headed

# 7. Use Playwright to verify visual changes
npx playwright screenshot homepage.png http://localhost:3000
```

### Creating Automated Visual Tests

```bash
# Create test file
nano tests/theme.spec.ts

# Add visual regression test:
import { test, expect } from '@playwright/test';

test.describe('Halal Directory Theme', () => {
  test('homepage should match theme', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check header color
    const header = page.locator('header');
    await expect(header).toHaveCSS('background-color', 'rgb(16, 185, 129)'); // halal green
    
    // Screenshot for visual regression
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('featured business card should have blue border', async ({ page }) => {
    await page.goto('http://localhost:3000/directory/ang-mo-kio');
    
    const featuredCard = page.locator('[data-featured="true"]').first();
    await expect(featuredCard).toHaveCSS('border-color', 'rgb(59, 130, 246)'); // featured blue
  });
});

# Run tests
npx playwright test

# Run in headed mode to see browser
npx playwright test --headed

# Generate report
npx playwright show-report
```

### Syncing CSS Changes Across Project

```bash
# After updating globals.css:
git add app/globals.css
git commit -m "style: update halal directory theme colors"
git push origin feature/theme-update

# Verify styling on staging
netlify deploy

# Check deployment
netlify status

# Test visually
npx playwright test --headed
```

---

## Testing & Quality Assurance

### Setting Up Playwright Tests

```bash
# Initialize Playwright
npx playwright install

# Create tests directory
mkdir -p tests

# Create test configuration
nano playwright.config.ts

# Add configuration:
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Creating Integration Tests

```bash
# Test user flows
nano tests/user-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Discovery Flow', () => {
  test('user can search and find business', async ({ page }) => {
    await page.goto('/');
    
    // Search
    await page.fill('[data-testid="search-input"]', 'halal');
    await page.click('[data-testid="search-button"]');
    
    // Verify results
    await expect(page.locator('[data-testid="business-card"]')).toHaveCount(1);
  });

  test('user can view business details', async ({ page }) => {
    await page.goto('/directory/ang-mo-kio');
    
    // Click first business
    await page.locator('[data-testid="business-card"]').first().click();
    
    // Verify detail page loaded
    await expect(page).toHaveURL(/\/business\/.*$/);
    await expect(page.locator('h1')).toContainText(/Halal/);
  });

  test('user can claim business', async ({ page }) => {
    await page.goto('/business/test-business-id');
    
    // Click claim button
    await page.click('text=Claim This Business');
    
    // Fill claim form
    await page.fill('[name="ownerName"]', 'John Doe');
    await page.fill('[name="ownerEmail"]', 'john@example.com');
    await page.click('button:has-text("Submit Claim")');
    
    // Verify confirmation
    await expect(page).toContainText('Claim submitted for review');
  });
});

# Run tests
npx playwright test tests/user-flow.spec.ts
```

### Creating Admin Dashboard Tests

```bash
# Test admin workflows
nano tests/admin.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('admin can approve business claim', async ({ page, context }) => {
    // Login as admin
    await context.addCookies([{
      name: 'admin-token',
      value: 'test-admin-token',
      url: 'http://localhost:3000'
    }]);
    
    await page.goto('/admin/claims');
    
    // Find pending claim
    const claim = page.locator('[data-testid="pending-claim"]').first();
    
    // Click approve
    await claim.locator('button:has-text("Approve")').click();
    
    // Verify claim approved
    await expect(page).toContainText('Claim approved');
  });

  test('admin can generate coupon codes', async ({ page }) => {
    await page.goto('/admin/coupons');
    
    // Click generate
    await page.click('button:has-text("Generate New Code")');
    
    // Fill form
    await page.selectOption('[name="discountType"]', 'percentage');
    await page.fill('[name="discountValue"]', '25');
    
    // Submit
    await page.click('button:has-text("Generate Code")');
    
    // Verify code generated
    const code = page.locator('[data-testid="coupon-code"]');
    await expect(code).toBeVisible();
  });
});

# Run admin tests
npx playwright test tests/admin.spec.ts
```

### CI/CD Testing with GitHub Actions

```bash
# Create GitHub Actions workflow
mkdir -p .github/workflows
nano .github/workflows/test.yml

# Add configuration:
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run lint
      
      - run: npx playwright install --with-deps
      
      - run: npm run build
      
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

# Push to GitHub
git add .github/workflows/test.yml
git commit -m "ci: add test workflow"
git push origin main
```

---

## Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Verify all tests pass
npm run lint
npm run build
npx playwright test

# 2. Check for console errors
npm run dev
# Open DevTools console - should be clean

# 3. Update environment variables for production
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-prod-project.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "[production-key]"

# 4. Test environment variables locally
echo $NEXT_PUBLIC_SUPABASE_URL

# 5. Verify Supabase production link
supabase link --project-ref your-project-ref

# 6. Deploy migrations to production
supabase db push --remote

# 7. Verify production database
supabase db status --remote

# 8. Final git status
git status  # Should be clean
git log -1  # Verify latest commit

# 9. Create production tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Deploying to Netlify

```bash
# Method 1: Direct CLI deployment
netlify deploy --prod

# Method 2: Deploy with preview first
netlify deploy
# Test on preview URL
# Then deploy to production:
netlify deploy --prod

# Method 3: Connect GitHub for auto-deploy
netlify init  # Follow prompts
# Now auto-deploys on push to main

# Verify deployment
netlify status
netlify open --admin  # Opens Netlify dashboard

# Check build logs if deployment fails
netlify logs
```

### Monitoring Production

```bash
# View site analytics
netlify analytics

# Check deployment history
netlify deploys:list

# View site details
netlify sites:list
netlify open  # Opens live site

# Monitor functions
netlify functions:list
netlify functions:logs

# Set up alerts
netlify env:set ALERT_EMAIL "admin@halaldirectory.com"
```

### Rollback if Needed

```bash
# Rollback to previous deployment
netlify deploy --prod  # Automatically deploys previous working version

# Or specify exact deployment
netlify deploys:list  # Find deployment ID
netlify rollback  # Rolls back to previous version

# Verify rollback
netlify status
```

---

## Complete End-to-End Workflow

### From Feature to Production

```bash
# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 1: CREATE FEATURE BRANCH                                 ║
# ╚════════════════════════════════════════════════════════════════╝

git checkout main
git pull origin main
git checkout -b feature/featured-listings

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 2: CREATE DATABASE MIGRATION                             ║
# ╚════════════════════════════════════════════════════════════════╝

supabase migration new add_featured_listings

# Edit migration file with schema changes
nano supabase/migrations/20250115_add_featured_listings.sql

# Apply locally
supabase db push

# Generate types
supabase gen types typescript --local > types/database.ts

# Commit migration
git add supabase/migrations/ types/database.ts
git commit -m "migration: add featured listings table"

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 3: DEVELOP FEATURE WITH CLAUDE CODE                      ║
# ╚════════════════════════════════════════════════════════════════╝

claude --dangerously-skip-permissions

# In Claude Code, use prompts from your guide:
# - Build featured listing components
# - Create featured upgrade page
# - Implement Stripe integration

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 4: TEST LOCALLY                                          ║
# ╚════════════════════════════════════════════════════════════════╝

npm run dev

# Use Playwright to test
npx playwright test --headed

# Extract CSS improvements
npx playwright codegen http://localhost:3000

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 5: BUILD & LINT                                          ║
# ╚════════════════════════════════════════════════════════════════╝

npm run build
npm run lint

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 6: COMMIT & PUSH                                         ║
# ╚════════════════════════════════════════════════════════════════╝

git add .
git commit -m "feat: implement featured listings system

- Add featured listings UI components
- Create upgrade page with Stripe integration
- Update area pages to sort featured first
- Add featured badge styling
- Implement renewal reminders"

git push origin feature/featured-listings

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 7: CREATE PULL REQUEST                                   ║
# ╚════════════════════════════════════════════════════════════════╝

gh pr create --title "Add featured listings system" \
  --body "Implements complete featured listing functionality including database schema, UI, and Stripe integration."

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 8: DEPLOY TO STAGING                                     ║
# ╚════════════════════════════════════════════════════════════════╝

netlify deploy

# Test on staging URL provided

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 9: CODE REVIEW & MERGE                                   ║
# ╚════════════════════════════════════════════════════════════════╝

# Wait for review feedback
# Make requested changes if needed
# Merge PR when approved

gh pr merge --squash

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 10: DEPLOY TO PRODUCTION                                 ║
# ╚════════════════════════════════════════════════════════════════╝

# Create production tag
git tag -a v1.1.0 -m "Release featured listings"
git push origin v1.1.0

# Deploy migrations to production
supabase db push --remote

# Deploy app to production
netlify deploy --prod

# ╔════════════════════════════════════════════════════════════════╗
# ║  STEP 11: MONITOR PRODUCTION                                   ║
# ╚════════════════════════════════════════════════════════════════╝

netlify status
netlify functions:logs

# Watch for errors in Sentry/error tracking
# Monitor analytics for new feature usage
```

---

## Troubleshooting

### Docker Issues

```bash
# Docker not running
# Solution: Open Docker Desktop application

# Port already in use (5432, 54321, 3000)
lsof -i :5432  # Find process using port
kill -9 [PID]   # Kill process
# OR
sudo lsof -ti:5432 | xargs kill -9

# Supabase containers not starting
docker logs [container-id]
docker restart [container-id]

# Docker disk space full
docker system prune
docker image prune -a
```

### Supabase Issues

```bash
# Cannot connect to Supabase
supabase status  # Check if running
supabase start   # Start if stopped

# Database migrations not applying
supabase db push --debug  # See detailed output

# TypeScript types out of sync
supabase gen types typescript --local > types/database.ts

# Lost local data
supabase db reset  # Resets to initial state (destructive)

# Production sync issues
supabase link --project-ref your-project-ref
supabase db push --remote
```

### GitHub Issues

```bash
# Authentication failed
gh auth logout
gh auth login  # Re-authenticate

# Cannot push to repo
git remote -v  # Verify remote URL
gh repo view   # Check permissions

# PR merge conflicts
git fetch origin
git merge origin/main
# Resolve conflicts manually
git add .
git commit -m "Resolve merge conflicts"
git push origin feature-branch
```

### Netlify Issues

```bash
# Deployment failed
netlify logs  # Check build logs

# Site not loading
netlify status
netlify open --admin  # Check dashboard

# Environment variables not set
netlify env:list
netlify env:set KEY "value"

# Rollback deployment
netlify rollback
netlify deploy --prod
```

### Playwright Issues

```bash
# Browser not found
npx playwright install

# Test timeout
npx playwright test --timeout=30000

# Screenshot mismatch (visual regression)
npx playwright test --update-snapshots

# Debug specific test
npx playwright test tests/filename.spec.ts --debug

# Run in UI mode
npx playwright test --ui
```

---

## Quick Command Reference

```bash
# ╔════ Development ════════════════════════════════════════════╗
npm run dev                    # Start development server
npm run build                  # Build for production
npm run lint                   # Lint code
npm test                       # Run tests

# ╔════ Database ══════════════════════════════════════════════╗
supabase start                 # Start local Supabase
supabase status                # Check status
supabase migration new [name]  # Create migration
supabase db push               # Apply migrations
supabase db reset              # Reset (DESTRUCTIVE)
supabase gen types             # Generate TypeScript types

# ╔════ Git ═══════════════════════════════════════════════════╗
git checkout -b feature/name   # Create feature branch
git add .                      # Stage changes
git commit -m "message"        # Commit
git push origin branch-name    # Push
gh pr create                   # Create PR
gh pr merge --squash           # Merge PR

# ╔════ Testing ═══════════════════════════════════════════════╗
npx playwright test            # Run all tests
npx playwright test --headed   # Run with browser visible
npx playwright codegen         # Record test by clicking
npx playwright show-report     # View test report

# ╔════ Deployment ════════════════════════════════════════════╗
netlify deploy                 # Deploy to staging
netlify deploy --prod          # Deploy to production
netlify status                 # Check deployment
netlify logs                   # View logs

# ╔════ Docker ════════════════════════════════════════════════╗
docker ps                      # List running containers
docker logs [id]               # View logs
docker stop [id]               # Stop container
docker ps -a                   # List all containers
docker system prune            # Cleanup
```

---

## Summary

This comprehensive guide integrates:

✅ **Supabase CLI** for local database management
✅ **GitHub CLI** for version control and PRs
✅ **Netlify CLI** for staging and production deployment
✅ **Docker CLI** for container management
✅ **Playwright** for testing and CSS processing
✅ **Claude Code** for AI-assisted development

**Key Workflows Covered:**
- Local setup with Docker + Supabase
- Feature branch development
- Database migration management
- Testing with Playwright
- Staging deployment via Netlify
- Production deployment
- Monitoring and troubleshooting

**All tools work together seamlessly** for a professional, enterprise-grade development workflow.

**Next Steps:**
1. Install all prerequisite tools
2. Clone boilerplate repository
3. Follow Step-by-Step Setup (above)
4. Start local development
5. Create first feature branch
6. Deploy to staging
7. Deploy to production
