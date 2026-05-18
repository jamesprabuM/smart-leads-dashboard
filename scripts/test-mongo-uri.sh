#!/usr/bin/env bash
# Test Atlas connection locally before pasting MONGODB_URI into Render.
set -euo pipefail

read -rsp "Paste MONGODB_URI to test: " URI
echo ""

node --input-type=module -e "
import mongoose from 'mongoose';
const uri = process.argv[1];
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('OK — MongoDB connected successfully');
  await mongoose.disconnect();
  process.exit(0);
} catch (e) {
  console.error('FAILED —', e.message);
  process.exit(1);
}
" "$URI"
