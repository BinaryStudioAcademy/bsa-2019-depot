#!/bin/bash
cd client/
npm run build
cd ..
zip -r latest client/build/ server/ > /dev/null
mkdir -p dpl_cd_upload
mv latest.zip dpl_cd_upload/latest.zip