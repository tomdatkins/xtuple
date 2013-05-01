#!/bin/bash
# Build extensions

# This could be more scalably done with node

rm -rf builds
mkdir builds

cp source/connect/client/root-package.js package.js
tools/deploy.sh
mkdir builds/connect
mv build/app.js builds/connect/connect.js

cp source/orange/client/root-package.js package.js
tools/deploy.sh
mkdir builds/orange
mv build/app.js builds/orange/orange.js

rm package.js
