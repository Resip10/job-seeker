/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, no-console */
const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Get current version
  const currentPkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const currentVersion = currentPkg.version;

  // Get previous version from git
  const previousPkgContent = execSync('git show HEAD~1:package.json', {
    encoding: 'utf-8',
  });
  const previousPkg = JSON.parse(previousPkgContent);
  const previousVersion = previousPkg.version;

  // Compare versions
  if (currentVersion !== previousVersion) {
    console.log(`✅ Version changed: ${previousVersion} → ${currentVersion}`);
    console.log('🚀 Proceeding with build...');
    process.exit(1); // Build
  } else {
    console.log(`⏭️  Version unchanged: ${currentVersion}`);
    console.log('⏸️  Skipping build (bump version in package.json to deploy)');
    process.exit(0); // Skip
  }
} catch (error) {
  // If error (first commit, no previous version), build anyway
  console.log('⚠️  Could not check previous version, proceeding with build');
  console.log(`Error: ${error.message}`);
  process.exit(1); // Build
}
