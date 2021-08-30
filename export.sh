#! /bin/sh

rm -rf dist
rm -rf .parcel-cache
parcel build --public-url '.' index.html

cp dist/* ../website/site/assets/programs/ripl-1/

