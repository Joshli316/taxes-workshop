#!/usr/bin/env bash
# Build a curated dist/ directory containing only production assets.
# Excludes CLAUDE.md, tests/, playwright.config.js, .gitignore, .wrangler/, .DS_Store.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist
cp index.html resources.html 404.html dist/
cp styles.css print.css dist/
cp app.js resources.js 404.js qrcode.min.js dist/
cp sw.js apple-touch-icon.png og.png dist/
cp _headers robots.txt sitemap.xml dist/
echo "dist/ built: $(ls -1 dist | wc -l | tr -d ' ') files"
