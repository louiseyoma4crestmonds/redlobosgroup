#!/usr/bin/env bash
set -euo pipefail

yarn install --frozen-lockfile --non-interactive
yarn migrate
yarn build