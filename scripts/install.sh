#!/bin/bash
cd client/
npm install
cd ../server/
npm install --only=prod
cd ../raw-server/
npm install --only=prod
cd ..