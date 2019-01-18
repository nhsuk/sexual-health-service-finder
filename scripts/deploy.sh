#!/bin/sh
#removing CI script for azure pipeline might help isolate AZdevops task.

git clone --depth 1 --single-branch --branch master https://github.com/nhsuk/ci-deployment.git scripts/ci-deployment

bash scripts/ci-deployment/deploy.sh
