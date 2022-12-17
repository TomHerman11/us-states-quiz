#!/usr/bin/env sh

# abort on errors
set -e

env PUBLIC_URL=https://tomherman11.github.io/us-states-quiz yarn build

cd build

git init
git add -A
git commit -m 'deploy build output to github pages'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:TomHerman11/us-states-quiz.git master:gh-pages
