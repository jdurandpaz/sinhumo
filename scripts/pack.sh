#!/bin/sh
# Empaqueta la extensión para la Chrome Web Store (sin tests ni docs del repo).
set -e
cd "$(dirname "$0")/.."
VERSION=$(node -p "require('./manifest.json').version")
mkdir -p dist
OUT="dist/sinhumo-$VERSION.zip"
rm -f "$OUT"
zip -qr "$OUT" manifest.json src options filters icons/icon-*.png LICENSE PRIVACY.md -x '*.DS_Store'
echo "$OUT"
