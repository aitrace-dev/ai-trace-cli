#!/bin/sh
bun run build
cp dist/index.html client/ai_trace/assets/index.html
cp README.md client/README.md
cp LICENSE client/LICENSE