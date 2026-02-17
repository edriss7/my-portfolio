# React Demo Apps

100 interactive React demo projects served by Express, ranging from beginner (todo, calculator) to enterprise-level (ERP, OS UI). All apps run client-side using React via CDN with Babel standalone — no build step required.

## Local Development

```bash
npm install
npm start
# → http://localhost:8080
```

## Run with Docker

### Build and run

```bash
docker build -t my-portfolio .
docker run -p 8080:8080 my-portfolio
# → http://localhost:8080
```

### Run in the background

```bash
docker run -d -p 8080:8080 --name my-portfolio my-portfolio
```

### Stop and remove

```bash
docker stop my-portfolio
docker rm my-portfolio
```

### Rebuild after changes

```bash
docker build -t my-portfolio .
docker run -p 8080:8080 my-portfolio
```

## Deploy to Google Cloud Platform

### Prerequisites

1. A GCP account with billing enabled
2. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
3. Authenticated with `gcloud auth login`
4. A GCP project created

### Option A: One-Command Deploy (Cloud Run — Recommended)

Cloud Run is serverless, scales to zero, and you only pay for what you use.

```bash
# Set your project ID (or it will use gcloud's default)
export GCP_PROJECT_ID=your-project-id

# Optional: change region (default: us-central1)
export GCP_REGION=us-central1

# Deploy
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Enable the required GCP APIs (Cloud Build, Cloud Run, Artifact Registry)
- Build the Docker container in the cloud
- Deploy to Cloud Run with public access
- Print the live URL when done

### Option B: Step-by-Step Manual Deploy (Cloud Run)

```bash
# 1. Set project
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# 3. Deploy from source (builds the Dockerfile in the cloud)
gcloud run deploy react-demos \
  --source=. \
  --region=us-central1 \
  --port=8080 \
  --memory=256Mi \
  --allow-unauthenticated

# 4. Get your URL
gcloud run services describe react-demos --region=us-central1 --format="value(status.url)"
```

### Option C: Compute Engine VM

For a traditional VM setup:

```bash
# 1. Create a VM
gcloud compute instances create react-demos \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --tags=http-server

# 2. Allow HTTP traffic
gcloud compute firewall-rules create allow-http \
  --allow=tcp:8080 \
  --target-tags=http-server

# 3. SSH in and set up
gcloud compute ssh react-demos --zone=us-central1-a

# On the VM:
sudo apt update && sudo apt install -y nodejs npm git
git clone <your-repo-url> app && cd app
npm install
node server.js &

# 4. Get external IP
gcloud compute instances describe react-demos \
  --zone=us-central1-a \
  --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
# → http://EXTERNAL_IP:8080
```

### Option D: App Engine

```bash
# 1. Create app.yaml
cat > app.yaml << 'EOF'
runtime: nodejs20
env: standard
instance_class: F1
automatic_scaling:
  max_instances: 3
EOF

# 2. Deploy
gcloud app deploy --quiet

# 3. Open
gcloud app browse
```

## Project Structure

```
├── server.js                  # Express server with all routes
├── package.json
├── Dockerfile                 # Container config for Cloud Run
├── deploy.sh                  # One-command GCP deploy script
├── public/
│   ├── index.html             # Home page
│   ├── app.jsx                # Home page app
│   ├── projects.html          # Projects catalog
│   ├── projects-app.jsx       # 100 project listings with demo links
│   ├── storybook.html         # Component storybook
│   ├── storybook-app.jsx      # 100 MUI-style components
│   ├── vegetarian-recipes.*   # Standalone recipe app
│   ├── chat.*                 # Standalone chat app
│   ├── notes.*                # Standalone notes app
│   ├── stocks.*               # Standalone stocks app
│   ├── ashpazi.*              # Standalone Persian recipes app
│   └── projects/
│       ├── todo.html + todo-app.jsx
│       ├── counter.html + counter-app.jsx
│       ├── ...                # 100 project HTML + JSX pairs
│       └── os-ui.html + os-ui-app.jsx
```

## Cost Estimate

| Service | Config | Estimated Cost |
|---------|--------|---------------|
| **Cloud Run** | 256 MB, scale to zero | ~$0/mo (free tier covers light use) |
| **Compute Engine** | e2-micro | ~$6/mo (free tier eligible) |
| **App Engine** | F1 standard | ~$0/mo (free tier: 28 instance-hours/day) |
