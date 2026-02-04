#!/bin/bash

# VERCEL DEPLOYMENT SCRIPT
# IslamicMatch (FADDL MATCH) - Quick Deploy

set -e

echo "🚀 IslamicMatch Vercel Deployment Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

# Check if logged in to Vercel
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo -e "${GREEN}✅ Authenticated${NC}"
echo ""

# Build check
echo -e "${BLUE}🔨 Running build check...${NC}"
npm run type-check
echo -e "${GREEN}✅ TypeScript check passed${NC}"
echo ""

# Environment check
echo -e "${BLUE}🔍 Checking environment variables...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo "Please create .env.local with required variables"
    exit 1
fi

# Check critical environment variables
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "$var" .env.local; then
        echo -e "${RED}❌ Missing required variable: $var${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

# Git check
echo -e "${BLUE}🌿 Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    echo "Commit your changes? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git add .
        echo "Enter commit message:"
        read -r commit_msg
        git commit -m "$commit_msg"
        git push origin main
        echo -e "${GREEN}✅ Changes committed and pushed${NC}"
    else
        echo -e "${YELLOW}⚠️  Deploying with uncommitted changes${NC}"
    fi
else
    echo -e "${GREEN}✅ Working directory clean${NC}"
fi
echo ""

# Deployment choice
echo -e "${BLUE}🚀 Ready to deploy!${NC}"
echo "Choose deployment type:"
echo "1) Preview deployment (development)"
echo "2) Production deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo -e "${BLUE}📦 Deploying to preview...${NC}"
        vercel
        ;;
    2)
        echo -e "${BLUE}🌟 Deploying to production...${NC}"
        vercel --prod
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Check deployment URL in terminal output"
echo "2. Configure environment variables in Vercel Dashboard if not done"
echo "3. Set up custom domain (optional)"
echo "4. Configure Stripe webhook with deployment URL"
echo "5. Test all pages and features"
echo ""
echo -e "${GREEN}🎉 Your app is live!${NC}"
echo ""
echo "For detailed setup guide, see: VERCEL_DEPLOYMENT_GUIDE.md"
