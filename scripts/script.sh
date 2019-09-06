#!/bin/bash
cd client/
npm run build
rm -rf !("build")
cd ..
rm -rf mobile
pip install --user awscli
aws s3 cp s3://depotbucket/.env.stage server/.env
zip -r latest * > /dev/null
mkdir -p dpl_cd_upload
mv latest.zip dpl_cd_upload/latest.zip