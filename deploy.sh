#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="react-demos"
MIN_INSTANCES=0
MAX_INSTANCES=3
MEMORY="256Mi"
CPU=1

# ─── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─── Pre-flight checks ──────────────────────────────────────────
command -v gcloud >/dev/null 2>&1 || error "gcloud CLI not found. Install it: https://cloud.google.com/sdk/docs/install"

if [ -z "$PROJECT_ID" ]; then
  PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
  [ -z "$PROJECT_ID" ] && error "No GCP project set. Run: export GCP_PROJECT_ID=your-project-id"
  warn "Using project from gcloud config: $PROJECT_ID"
fi

info "Deploying to project: $PROJECT_ID  |  region: $REGION"

# ─── Enable required APIs ────────────────────────────────────────
info "Enabling required GCP APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --project="$PROJECT_ID" --quiet

# ─── Build & deploy to Cloud Run ─────────────────────────────────
info "Building container and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --source=. \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --port=8080 \
  --memory="$MEMORY" \
  --cpu="$CPU" \
  --min-instances="$MIN_INSTANCES" \
  --max-instances="$MAX_INSTANCES" \
  --allow-unauthenticated \
  --quiet

# ─── Get the service URL ─────────────────────────────────────────
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --format="value(status.url)")

echo ""
info "Deployment complete!"
echo -e "${GREEN}────────────────────────────────────────${NC}"
echo -e "  App live at: ${GREEN}${SERVICE_URL}${NC}"
echo -e "${GREEN}────────────────────────────────────────${NC}"
