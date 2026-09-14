#!/usr/bin/env bash
# Checks what an app actually receives when it installs Bacon from GitHub.
#
#   scripts/check-installed-package.sh <app>/node_modules/@druloloy/bacon-ui
#
# CI runs it after installing with npm and with yarn, and again after reinstalling from the
# lockfile. You can run it against your own app the same way.
set -uo pipefail

PKG="${1:?usage: check-installed-package.sh <path to node_modules/@druloloy/bacon-ui>}"
fail=0

# The build output. If these are missing, the install never ran Bacon's prepare script.
for f in lib/commonjs/index.js lib/module/index.js lib/typescript/src/index.d.ts src/index.ts; do
  if [ ! -f "$PKG/$f" ]; then
    echo "::error::$f is missing: the install did not build the library"
    fail=1
  fi
done

# Repository-only folders. Only src/, lib/ and the docs files should ship.
for d in tests stories example docs scripts coverage .github; do
  if [ -e "$PKG/$d" ]; then
    echo "::error::$d/ should not ship in the installed package"
    fail=1
  fi
done

# A nested React or React Native makes the app load two copies and fail with "Invalid hook call".
# Other nested entries, such as Yarn's empty .bin folder, are harmless.
for dep in react react-native; do
  if [ -d "$PKG/node_modules/$dep" ]; then
    echo "::error::the installed package carries its own $dep"
    fail=1
  fi
done

if [ "$fail" -eq 0 ]; then
  echo "Installed package is complete and ships nothing extra: $PKG"
fi
exit "$fail"
