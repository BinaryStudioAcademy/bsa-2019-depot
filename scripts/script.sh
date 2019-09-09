#!/bin/bash
cd client/
npm run build
rm -rf !("build")
cd ..
rm -rf mobile
pip install --user awscli
aws s3 cp s3://depotbucket/.env.prod server/.env
zip -r prod * > /dev/null
mkdir -p dpl_cd_upload
mv prod.zip dpl_cd_upload/prod.zip