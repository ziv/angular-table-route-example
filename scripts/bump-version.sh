#!/bin/sh
LAST_TAG=$(git tag | tail -1)
NEXT_VERSION=$(semver $LAST_TAG -i)

#sed -i "s/UI_VERSION_PLACEHOLDER/v${NEXT_VERSION}/g" ./dist/techdebt/browser/config.json

export X_NEXT_VERSION="v$NEXT_VERSION"
echo "v$NEXT_VERSION"

