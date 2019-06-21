#!/bin/sh
set -ex

if [ "$TRAVIS" != "true" ]; then
  # Only do something on travis.
  echo "This script is supposed to be run inside the travis environment."
  return 1;
fi

if [ "$TRAVIS_NODE_VERSION" != "12" ]; then
  # Only proceed if node is set to version 12.
  return 0;
fi

npm run coveralls
