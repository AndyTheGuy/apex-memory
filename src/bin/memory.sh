#!/usr/bin/env bash

# ApexMemory CLI Router Script
# Designed for Git Bash on Windows

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

ACTION=$1
PARAM1=$2
PARAM2=$3
PARAM3=$4

if [ -z "$ACTION" ]; then
  echo "=== ApexMemory: Local WASM Semantic Memory Engine ==="
  echo "Usage:"
  echo "  ./memory.sh snapshot                      - Compile dynamic memory.md index (Frozen Snapshot)"
  echo "  ./memory.sh mine                          - Run Back-Catalog Miner to ingest all past session logs"
  echo "  ./memory.sh query \"<query_text>\"          - Perform semantic search across past memories"
  echo "  ./memory.sh insert \"<text>\" [src] [topic] - Insert a custom memory chunk semantically"
  echo "  ./memory.sh consolidate                   - Resolve overlapping or conflicting memory rules"
  echo "  ./memory.sh viz                           - Real-time ASCII visualization and database metrics"
  echo "  ./memory.sh dashboard                     - Compile and launch HTML interactive web visualizer"
  echo "  ./memory.sh disable                       - Disable memory system for this active project"
  echo "  ./memory.sh enable                        - Re-enable memory system for this active project"
  echo "  ./memory.sh disable-global                - Disable memory system globally for all projects"
  echo "  ./memory.sh enable-global                 - Re-enable memory system globally for all projects"
  exit 0
fi

if [ "$ACTION" == "snapshot" ]; then
  node snapshot.js
elif [ "$ACTION" == "mine" ]; then
  node mine.js
elif [ "$ACTION" == "consolidate" ]; then
  node consolidate.js
elif [ "$ACTION" == "viz" ]; then
  node viz.js
elif [ "$ACTION" == "dashboard" ]; then
  node dashboard.js
elif [ "$ACTION" == "disable" ] || [ "$ACTION" == "enable" ] || [ "$ACTION" == "disable-global" ] || [ "$ACTION" == "enable-global" ]; then
  # Route toggle commands natively through local CLI proxy to handle re-compilation and path checks
  node ../../../cli.js "$ACTION"
elif [ "$ACTION" == "query" ]; then
  if [ -z "$PARAM1" ]; then
    echo "Error: Missing query string."
    echo "Usage: ./memory.sh query \"<query_text>\""
    exit 1
  fi
  node vector-db.js query "$PARAM1"
elif [ "$ACTION" == "insert" ]; then
  if [ -z "$PARAM1" ]; then
    echo "Error: Missing text to insert."
    echo "Usage: ./memory.sh insert \"<text>\" [source] [topic]"
    exit 1
  fi
  node vector-db.js insert "$PARAM1" "$PARAM2" "$PARAM3"
else
  echo "Unknown command: $ACTION"
  echo "Run ./memory.sh with no arguments to see usage guidelines."
  exit 1
fi
