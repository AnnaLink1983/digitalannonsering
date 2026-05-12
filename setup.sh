#!/bin/bash
# ============================================================
# ICA Elements Prototyping — Setup
# ============================================================
# Kör detta script:
#   - En gång efter att du kopierat project-template till en ny mapp.
#   - På en ny dator (scriptet detekterar och återhämtar automatiskt
#     från "Cannot find native binding"-felet som uppstår när
#     node_modules har kopierats mellan maskiner).
#
# Användning:
#   chmod +x setup.sh && ./setup.sh
#
# Efter setup:
#   cd prototyp/app && npm run dev
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/prototyp/app"
ICA_ELEMENTS_DIR="$SCRIPT_DIR/prototyp/node_modules/@ica-azure/ica-elements"

echo ""
echo "=== ICA Elements Prototyping — Setup ==="
echo ""

# ------------------------------------------------------------
# 1. Kör vi från rätt mapp?
# ------------------------------------------------------------
if [ ! -d "$APP_DIR" ]; then
  echo "Fel: Hittar inte prototyp/app/ — kör scriptet från project-template-roten."
  exit 1
fi

# ------------------------------------------------------------
# 2. Är Node.js installerat?
# ------------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "Fel: Node.js är inte installerat (eller inte i PATH)."
  echo ""
  echo "Installera via en av följande:"
  echo "  - nvm (rekommenderat): https://github.com/nvm-sh/nvm"
  echo "  - Homebrew:            brew install node"
  echo "  - Direktnedladdning:   https://nodejs.org/"
  echo ""
  echo "Minst Node 20 krävs (Vite 8)."
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Varning: Node $(node -v) är äldre än v20. Vite 8 kräver minst v20.19."
  echo "         Uppgradera om dev-servern inte startar."
  echo ""
fi

# ------------------------------------------------------------
# 3. Finns det privata ICA-paketet?
# ------------------------------------------------------------
if [ ! -d "$ICA_ELEMENTS_DIR" ]; then
  echo "Fel: @ica-azure/ica-elements saknas i prototyp/node_modules/."
  echo ""
  echo "Paketet ligger på ICAs privata registry och kan inte hämtas via npm."
  echo "Kopiera hela @ica-azure-mappen manuellt från en befintlig prototyp:"
  echo ""
  echo "  cp -r /path/till/annan-prototyp/prototyp/node_modules/@ica-azure \\"
  echo "        $SCRIPT_DIR/prototyp/node_modules/"
  echo ""
  exit 1
fi

# ------------------------------------------------------------
# 4. Är befintlig node_modules byggt för rätt plattform?
# ------------------------------------------------------------
# Native bindings (rolldown, lightningcss) är plattformsspecifika. Om
# node_modules har kopierats mellan datorer saknas matchande binding och
# dev-servern kraschar med "Cannot find native binding. npm has a bug
# related to optional dependencies".
#
# Vi detekterar detta genom att leta efter rätt rolldown-binding för
# aktuell plattform. Saknas den: rensa node_modules + package-lock.json
# och kör om npm install med lokal npm.
UNAME_S=$(uname -s)
UNAME_M=$(uname -m)
case "$UNAME_S-$UNAME_M" in
  Darwin-arm64)   ROLLDOWN_BINDING="darwin-arm64" ;;
  Darwin-x86_64)  ROLLDOWN_BINDING="darwin-x64" ;;
  Linux-aarch64)  ROLLDOWN_BINDING="linux-arm64-gnu" ;;
  Linux-arm64)    ROLLDOWN_BINDING="linux-arm64-gnu" ;;
  Linux-x86_64)   ROLLDOWN_BINDING="linux-x64-gnu" ;;
  *)              ROLLDOWN_BINDING="" ;;
esac

NEEDS_CLEAN=0
if [ -d "$APP_DIR/node_modules" ] && [ -n "$ROLLDOWN_BINDING" ]; then
  BINDING_NODE_FILE="$APP_DIR/node_modules/@rolldown/binding-$ROLLDOWN_BINDING/rolldown-binding.$ROLLDOWN_BINDING.node"
  if [ ! -f "$BINDING_NODE_FILE" ]; then
    echo "Upptäckt: Befintlig node_modules saknar native binding för"
    echo "          $UNAME_S-$UNAME_M (troligen installerad på en annan maskin)."
    echo "          Rensar och installerar om med lokal npm..."
    echo ""
    NEEDS_CLEAN=1
  fi
fi

if [ "$NEEDS_CLEAN" = "1" ]; then
  rm -rf "$APP_DIR/node_modules" "$APP_DIR/package-lock.json"
fi

# ------------------------------------------------------------
# 5. Installera
# ------------------------------------------------------------
echo "Installerar dependencies i prototyp/app/..."
cd "$APP_DIR"
npm install

echo ""
echo "Klart! Starta dev-server med:"
echo "  cd prototyp/app && npm run dev"
echo ""
