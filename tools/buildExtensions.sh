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

cp source/orange/client/root-package.js package.js
tools/deploy.sh
mkdir builds/orange
mv build/app.js builds/orange/orange.js

cp source/incident_plus/client/root-package.js package.js
tools/deploy.sh
mkdir builds/incident_plus
mv build/app.js builds/incident_plus/incident_plus.js

rm package.js
