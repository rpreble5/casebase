#!/usr/bin/env bash
# Publish the current branch to the live site.
#
# Pages only deploys from main (the github-pages environment's branch policy
# rejects anything else), so shipping means updating both refs: the working
# branch as the record, main as what actually goes live.
#
# Typecheck and build run first — a broken build should never reach the site,
# and finding out here is faster than finding out from a red CI run.
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$BRANCH" == "main" ]]; then
  echo "Already on main; just push."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Commit first."
  git status --short
  exit 1
fi

echo "==> building"
npm run build >/dev/null

echo "==> pushing $BRANCH"
git push -u origin "$BRANCH"

echo "==> fast-forwarding main"
git push origin "$BRANCH:refs/heads/main"

echo
echo "Deploying $(git rev-parse --short HEAD) → https://rpreble5.github.io/casebase/"
echo "The build stamp in the header shows the same short SHA once it's live."
