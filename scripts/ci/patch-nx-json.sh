#!/bin/bash
set -euo pipefail

project_root=$(git rev-parse --show-toplevel)
tmp=$(mktemp)
jq '.tasksRunnerOptions.default.runner = "@nrwl/nx-cloud"' "${project_root}/nx.json" > "$tmp" && mv "$tmp" "${project_root}/nx.json"