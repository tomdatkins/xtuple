#!/bin/bash
# Build extensions

# This could be more scalably done with node

rm -rf builds
mkdir builds

cp source/connect/client/root-package.js package.js
tools/deploy.sh
mkdir builds/connect
mv build/app.js builds/connect/connect.js

cp source/ppm/client/root-package.js package.js
tools/deploy.sh
mkdir builds/ppm
mv build/app.js builds/ppm/ppm.js

rm package.js
