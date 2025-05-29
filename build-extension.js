const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Chrome extension...');

// Run Vite build
try {
  console.log('Running Vite build with NODE_ENV=development...');
  // The NODE_ENV is set in package.json, but we'll make sure it's passed to the vite build command
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
} catch (error) {
  console.error('Vite build failed:', error);
  process.exit(1);
}

// Create dist directory structure
console.log('Setting up extension directory structure...');

// Create js directory if it doesn't exist
if (!fs.existsSync('dist/js')) {
  fs.mkdirSync('dist/js', { recursive: true });
}

// Create images directory if it doesn't exist
if (!fs.existsSync('dist/images')) {
  fs.mkdirSync('dist/images', { recursive: true });
}

// Copy manifest.json if it doesn't exist in dist
const distManifestPath = path.resolve(__dirname, 'dist/manifest.json');
if (!fs.existsSync(distManifestPath)) {
  console.log('Copying manifest.json...');
  fs.copyFileSync(
    path.resolve(__dirname, 'assets/manifest.json'),
    distManifestPath
  );
}

// Copy images directory if needed
const copyDir = (src, dest) => {
  // Check if source directory exists
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist, skipping copy.`);
    return;
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Copy images directory if it's empty
const imagesDir = path.resolve(__dirname, 'dist/images');
if (fs.existsSync(imagesDir) && fs.readdirSync(imagesDir).length === 0) {
  console.log('Copying images...');
  copyDir(
    path.resolve(__dirname, 'assets/images'),
    imagesDir
  );
}

// Remove index.html if it exists (not needed for Chrome extension)
const indexPath = path.resolve(__dirname, 'dist/index.html');
if (fs.existsSync(indexPath)) {
  fs.unlinkSync(indexPath);
  console.log('Removed index.html (not needed for Chrome extension)');
}

console.log('Chrome extension build completed successfully!');
