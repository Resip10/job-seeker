# Vercel Build Configuration

## Version-Based Deployments

This project is configured to **only deploy when the version in `package.json` changes**.

### How It Works

- Vercel checks `.config/vercel-version-check.js` before every build
- If version changed → Build proceeds ✅
- If version unchanged → Build skipped ⏭️

### Deploying to Production

#### Option 1: Use npm scripts (Recommended)

```bash
# Patch release (0.1.2 → 0.1.3)
npm run release:patch

# Minor release (0.1.2 → 0.2.0)
npm run release:minor

# Major release (0.1.2 → 1.0.0)
npm run release:major

# Push to trigger deployment
git push && git push --tags
```

#### Option 2: Manual version bump

```bash
# Edit package.json version: "0.1.2" → "0.1.3"
git add package.json
git commit -m "Release v0.1.3"
git push
```

### Manual Deployments (Without Version Change)

If you need to deploy without bumping version:

#### Via Vercel Dashboard

1. Go to your project → Deployments
2. Click "..." on any deployment
3. Click "Redeploy"

#### Via Vercel CLI

```bash
npx vercel --prod
```

### Cost Savings

This configuration will skip ~90%+ of builds, deploying only on intentional releases.
