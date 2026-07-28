# AI NEET Predictor & Medical Counselling Platform

An AI-powered web application for medical aspirants across India. The platform predicts All India Ranks (AIR) based on NEET marks (UG, PG, MDS), matches students with eligible government and private medical colleges based on categories and quota rules, provides interactive stage-by-stage counselling timelines, and generates downloadable personalised counselling kits.

---

## 🌟 Key Features

- **NEET Rank Predictor**: Instantly estimates All India Ranks (AIR), percentile scores, and 4-year trend analysis for NEET UG (720 marks), NEET PG (800 marks), and NEET MDS (960 marks).
- **College Predictor**: Matches predicted ranks against real cutoff data across AIQ (15%) and State Quota (85%) seats, filterable by Exam, Course (MBBS, BDS, BAMS, BHMS), Category (UR, OBC, SC, ST, EWS), and State.
- **Interactive Counselling Timeline**: Renders stage-by-stage horizontal steppers for MCC and State quota counselling rounds.
- **Personalised Counselling Kit**: Direct Blob-based PDF download containing custom choice-filling order and college recommendations without opening browser print dialogues.
- **Resilient Dual AI Engine**: Integrates Google Gemini AI Studio and Perplexity AI (Sonar model) with automatic JSON auto-repair and built-in historical NTA NEET cutoff dataset fallbacks for 100% uptime.
- **Lead Capture System**: Uniform "Counselling Kit" request modal across header, hero, and results cards capturing student details (Name, Email, Mobile).

---

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables Design System
- **Icons**: Lucide React Icons
- **AI Integrations**: Google Gemini REST API & Perplexity AI API (`sonar`)
- **PDF Engine**: Serverless PDF Generator (`app/api/counselling/pdf/route.ts`)
- **Database Access**: PostgreSQL / Node-PG (Admin panel) & Client-side `localStorage` persistence

### Project Structure
```
├── app/
│   ├── (front-end)/
│   │   ├── admin/                # Admin Panel for managing cutoff database & requests
│   │   ├── auth/                 # Admin authentication routes
│   │   ├── college-counselling/  # Stage-by-stage counselling page & PDF download
│   │   └── college-predict/      # College prediction grid & Info modal
│   ├── api/
│   │   ├── ai-predict-colleges/  # AI route for matching colleges
│   │   ├── ai-predict-markTorank/# AI route for score-to-rank prediction
│   │   ├── counselling/pdf/      # Route for generating PDF Counselling Kits
│   │   └── expert-help/          # Lead capture submission API
│   ├── globals.css               # Design system tokens & global header styles
│   ├── layout.tsx                # Root HTML layout wrapper
│   ├── not-found.tsx             # 404 page handler
│   └── page.tsx                  # Home page & Hero Rank Predictor
├── components/
│   ├── MedicalPulseLoader.tsx    # Hospital ECG pulse animation loading monitor
│   └── ui/                       # Reusable UI primitives (Card, Dialog, Button, etc.)
├── constants/
│   └── index.ts                  # NEET exams, courses, categories, and state codes
├── lib/
│   └── ai/
│       ├── gemini.ts             # Gemini API client + JSON repair + Historical dataset fallback
│       ├── perplexity.ts         # Perplexity API client + JSON repair engine
│       └── prompts.ts            # System prompt templates for rank & college matching
├── public/                       # Static images, assets, and counselling PDFs
├── .env                          # Environment variables configuration
└── package.json                  # NPM dependencies and scripts
```

---

## ⚙️ AI Engine & Resilient Fallback System

The application features a 3-tier fallback architecture to guarantee uninterrupted service:

1. **Primary AI Request**: Calls Google Gemini AI Studio or Perplexity AI depending on `AI_API_TO_USE` in `.env`.
2. **Provider Failover**: If the primary provider encounters a quota limit or credential error (e.g. HTTP 403), the API automatically routes the query to the secondary provider (`PERPLEXITY_API_KEY`).
3. **JSON Repair & Historical Fallback**: If AI output gets truncated or formatted incorrectly, the custom `repairTruncatedJson` algorithm balances dangling quotes, arrays (`[`), and objects (`{`). If API keys are missing or offline, it falls back to built-in historical NTA NEET score-rank distributions (`getFallbackRankPrediction`) and medical college closing rank databases (`getFallbackCollegePrediction`).

---

## 🛠️ Ubuntu Server Setup & Deployment Guide

Follow these step-by-step instructions to host the application on a fresh Ubuntu 20.04 or 22.04 LTS server with Node.js, PM2 process manager, Nginx reverse proxy, and SSL certificate.

### Prerequisites
- A server running **Ubuntu 20.04 / 22.04 LTS**
- A domain or subdomain pointed to your server's public IP address
- SSH access with `sudo` privileges

---

### Step 1: System Update & Node.js Installation

1. Update the system package repository:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. Install Node.js 20 LTS via NodeSource repository:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs git build-essential
   ```

3. Verify Node.js and NPM installation:
   ```bash
   node -v # Should display v20.x.x
   npm -v
   ```

---

### Step 2: Install PM2 & Nginx

1. Install **PM2** globally to manage Node.js processes in the background:
   ```bash
   sudo npm install -g pm2
   ```

2. Install **Nginx** web server:
   ```bash
   sudo apt install -y nginx
   ```

3. Enable and start Nginx:
   ```bash
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

---

### Step 3: Clone Project & Install Dependencies

1. Navigate to web root directory:
   ```bash
   cd /var/www/html/Projects/Next-js-Projects
   ```

2. Clone your repository (or copy project files):
   ```bash
   git clone <your-repository-url> AI-NEET-Predictor
   cd AI-NEET-Predictor
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

---

### Step 4: Configure Environment Variables

Create and configure your `.env` file:
```bash
cp sample.env .env
nano .env
```

Add your production environment variables:
```env
# AI API Selection ('gemini' or 'perplexity')
AI_API_TO_USE=gemini

# Google Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=AIzaSyYourActualKeyHere

# Perplexity AI API Key (Optional fallback)
PERPLEXITY_API_KEY=pplx-YourActualKeyHere

# SMTP Credentials for Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Credentials
ADMIN_USER=admin@example.com
```

---

### Step 5: Build Production Application

Run the Next.js production build:
```bash
npm run build
```

Verify that the output displays `✓ Compiled successfully`.

---

### Step 6: Start Application with PM2

1. Launch the Next.js application using PM2 on port 3000:
   ```bash
   pm2 start npm --name "neet-predictor" -- run start -- -p 3000
   ```

2. Save PM2 state to restart automatically on server reboot:
   ```bash
   pm2 save
   sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
   ```

3. Check process status:
   ```bash
   pm2 status
   ```

---

### Step 7: Configure Nginx Reverse Proxy

1. Create a new Nginx site configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/neet-predictor
   ```

2. Paste the following configuration (replace `your-domain.com` with your actual domain):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       client_max_body_size 20M;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Enable the configuration by linking it to `sites-enabled`:
   ```bash
   sudo ln -s /etc/nginx/sites-available/neet-predictor /etc/nginx/sites-enabled/
   ```

4. Test Nginx configuration for syntax errors:
   ```bash
   sudo nginx -t
   ```

5. Reload Nginx to apply changes:
   ```bash
   sudo systemctl reload nginx
   ```

---

### Step 8: SSL Certificate Setup (Let's Encrypt / HTTPS)

1. Install Certbot for Nginx:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain and install SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. Verify automatic SSL renewal test:
   ```bash
   sudo certbot renew --dry-run
   ```

---

## 📌 Useful Server Maintenance Commands

- **Restart Application**: `pm2 restart neet-predictor`
- **View Real-Time Logs**: `pm2 logs neet-predictor`
- **Monitor System Resources**: `pm2 monit`
- **Reload Nginx**: `sudo systemctl reload nginx`
- **Rebuild Project after Updates**:
  ```bash
  git pull
  npm install
  npm run build
  pm2 restart neet-predictor
  ```

---

## 📄 License & Contact

© 2026 Campus Continents. All Rights Reserved. Data sourced from official NTA NEET results and MCC counselling records for student guidance purposes.
