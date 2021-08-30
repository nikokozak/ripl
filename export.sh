#! /bin/sh

parcel rm -rf dist
parcel rm -rf .parcel-cache
parcel build '.' index.html

cp dist/* ../website/site/assets/programs/ripl-1/

