#!/bin/bash
cd client/
npm install
rm -rf !("build")
cd ../server/
npm install
cd ..