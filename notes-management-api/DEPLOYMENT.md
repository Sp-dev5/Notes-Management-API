# Deployment Guide

## Pre-Deployment Checklist

- [ ] Update all environment variables for production
- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Set NODE_ENV=production
- [ ] Configure database backups
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Review security headers
- [ ] Test all API endpoints in production mode
- [ ] Verify CORS is properly configured
- [ ] Set up automated backups

## Environment Configuration

### Backend .env for Production

```env
# Database
DATABASE_URL="postgresql://produser:strongpassword@db-server.example.com:5432/notes_prod"

# Server
PORT=5000
NODE_ENV=production

# JWT (generate new secure keys)
JWT_SECRET="generate-a-new-random-string-at-least-32-characters"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="generate-another-random-string-at-least-32-characters"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS (update to your frontend domain)
FRONTEND_URL="https://notes.example.com"
```

### Generate Secure Keys

```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

## Deployment Options

### Option 1: Traditional VPS

#### Server Setup
```bash
# SSH into server
ssh ubuntu@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Database Setup
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE notes_prod;
CREATE USER produser WITH PASSWORD 'strongpassword';
ALTER ROLE produser SET client_encoding TO 'utf8';
ALTER ROLE produser SET default_transaction_isolation TO 'read committed';
ALTER ROLE produser SET default_transaction_deferrable TO on;
ALTER ROLE produser SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE notes_prod TO produser;
\q
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/your-username/notes-management-api.git
cd notes-management-api/backend

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.example .env
# Edit .env with production values

# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Start with PM2
pm2 start "npm start" --name "notes-api"
pm2 startup
pm2 save
```

#### Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/notes-api
```

```nginx
upstream notes_api {
  server 127.0.0.1:5000;
}

server {
  listen 80;
  server_name api.notes.example.com;

  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.notes.example.com;

  # SSL certificates
  ssl_certificate /etc/letsencrypt/live/api.notes.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.notes.example.com/privkey.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Gzip compression
  gzip on;
  gzip_vary on;
  gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

  location / {
    proxy_pass http://notes_api;
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

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/notes-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL Certificate (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d api.notes.example.com
sudo certbot renew --dry-run  # Test auto-renewal
```

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create notes-api-production

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-secure-key"
heroku config:set JWT_REFRESH_SECRET="your-secure-key"
heroku config:set FRONTEND_URL="https://notes.example.com"

# Deploy
git push heroku main

# Run migrations
heroku run "npm run db:migrate"
heroku run "npm run seed"

# View logs
heroku logs --tail
```

### Option 3: Docker on Production Server

```bash
# Build images
docker build -f Dockerfile.backend -t notes-backend:latest .
docker build -f Dockerfile.frontend -t notes-frontend:latest .

# Push to registry
docker push your-registry/notes-backend:latest
docker push your-registry/notes-frontend:latest

# Deploy on server
docker-compose -f docker-compose.yml up -d

# Updates
docker-compose pull
docker-compose up -d
```

### Option 4: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://api.notes.example.com/api/v1
```

#### Deploy Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Set environment variables
railway variables

# Deploy
railway up
```

## Post-Deployment Tasks

### 1. Database Backup
```bash
# Automated daily backup
0 2 * * * pg_dump -U produser notes_prod | gzip > /backups/notes_$(date +\%Y\%m\%d).sql.gz
```

### 2. Monitoring
- Set up monitoring with New Relic, DataDog, or similar
- Configure alerts for:
  - High CPU/Memory usage
  - Database connection errors
  - API response time > 1s
  - Error rate > 1%

### 3. Logging
```bash
# View application logs
pm2 logs notes-api

# Or use logging service like:
# - LogRocket
# - Sentry
# - Papertrail
```

### 4. Security Hardening

#### Firewall Rules
```bash
# Only allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### Fail2Ban
```bash
sudo apt install fail2ban
sudo systemctl start fail2ban
```

### 5. Performance Optimization

#### Database Indexing
```sql
-- Optimize queries
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_search ON notes USING GIN (to_tsvector('english', title || ' ' || content));
```

#### Caching
Consider adding Redis for:
- Session caching
- Search results caching
- Rate limiting

### 6. Monitoring Health
```bash
# Health check endpoint
curl https://api.notes.example.com/health

# API docs
curl https://api.notes.example.com/api/docs
```

## Troubleshooting

### Common Issues

#### High Memory Usage
```bash
pm2 monit  # Monitor memory usage
# Consider increasing Node heap size
NODE_OPTIONS="--max-old-space-size=2048" pm2 start ...
```

#### Database Connection Issues
```bash
# Check connection string
psql $DATABASE_URL

# Check pool size if using connection pooling
```

#### CORS Errors
- Verify FRONTEND_URL matches actual domain
- Check browser console for specific errors

#### Slow Queries
```sql
-- Find slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC;
```

## Rollback Strategy

```bash
# Keep previous versions
git tag release-1.0.0
git push origin release-1.0.0

# Rollback if needed
git checkout release-1.0.0
npm run build
pm2 restart notes-api
```

## Monitoring Checklist

Daily:
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Check database size
- [ ] Verify backups

Weekly:
- [ ] Performance review
- [ ] Security scan
- [ ] Dependency updates (on test first)

Monthly:
- [ ] Full security audit
- [ ] Capacity planning
- [ ] Disaster recovery test

---

**Happy deployment! 🚀**
