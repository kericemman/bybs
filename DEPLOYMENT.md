# Hostinger VPS Production Deployment

The production layout is:

- Nginx serves `build-your-best/dist`.
- Nginx proxies `/api/*` to Express on `127.0.0.1:5002`.
- PM2 keeps one API process running from `ecosystem.config.cjs`.
- MongoDB, Cloudinary, and Resend remain external services.

The API intentionally binds to localhost. Do not expose port `5002` through the VPS firewall.

## 1. Prerequisites

Use Node.js 22 LTS, Nginx, Git, Certbot, and PM2:

```bash
node --version
npm --version
sudo npm install --global pm2
```

The repository is expected at `/var/www/bybs/bybs`. If it lives elsewhere, update the `root` path in `deploy/nginx/buildyourbestself.org.conf`.

## 2. Environment Files

Create the backend environment file once. Never commit it:

```bash
cd /var/www/bybs/bybs/backend
cp .env.example .env
nano .env
chmod 600 .env
```

Generate a production JWT secret with:

```bash
openssl rand -hex 48
```

Replace every placeholder in `.env`. Production startup now fails early when MongoDB, authentication, Cloudinary, Resend, the sender address, the admin address, or HTTPS origin configuration is missing.

Create the frontend build environment:

```bash
cd /var/www/bybs/bybs/build-your-best
cp .env.example .env
nano .env
chmod 600 .env
```

Keep `VITE_API_URL=/api` so admin cookies remain same-origin. `SITEMAP_API_URL` points the build-time sitemap generator at the localhost API and is never included in the browser bundle. `SITEMAP_STRICT=true` makes a production build fail instead of silently publishing a sitemap without dynamic articles, cohorts, products, reflections, or impact stories.

## 3. First Deployment

Install the API with production dependencies and start it:

```bash
cd /var/www/bybs/bybs/backend
npm ci --omit=dev
cd ..
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

Install and build the frontend:

```bash
cd /var/www/bybs/bybs/build-your-best
npm ci
npm run build
```

The build writes the generated sitemap only to `dist/sitemap.xml`, so deployment no longer modifies tracked source files.

## 4. TLS And Nginx

The supplied Nginx file expects an existing Certbot certificate. On a first deployment, obtain it before enabling the site. If Nginx is already using port 80, stop it briefly or use Hostinger's SSL setup instead:

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d buildyourbestself.org -d www.buildyourbestself.org
sudo systemctl start nginx
```

Then copy the provided site file, enable it, and validate Nginx:

```bash
sudo cp /var/www/bybs/bybs/deploy/nginx/buildyourbestself.org.conf /etc/nginx/sites-available/buildyourbestself.org
sudo ln -s /etc/nginx/sites-available/buildyourbestself.org /etc/nginx/sites-enabled/buildyourbestself.org
sudo nginx -t
sudo systemctl reload nginx
```

The HTTPS block expects the certificate at `/etc/letsencrypt/live/buildyourbestself.org/`. Confirm Certbot renewal with `sudo certbot renew --dry-run`.

Keep MongoDB restricted to the required network addresses, keep SSH key-only where possible, and expose only ports `22`, `80`, and `443` through the VPS firewall.

## 5. Verification

Run these after every deployment:

```bash
curl --fail --silent --show-error https://buildyourbestself.org/api/health
curl --fail --silent --show-error https://buildyourbestself.org/api/articles
curl --head https://buildyourbestself.org
pm2 status
pm2 logs bybs-api --lines 100
```

Then verify in a private browser window:

- Public home, programmes, insights, cohort, contact, shop, and support pages.
- Contact, waitlist, testimonial, and application submissions.
- Admin login, logout, password change, article editing, and image upload.
- Product and ebook upload. Ebook files are stored as authenticated Cloudinary assets and are not returned by public product APIs.
- `robots.txt` and `sitemap.xml`.

## 6. Routine Updates

The working tree should be clean before pulling:

```bash
cd /var/www/bybs/bybs
git status --short
git pull --ff-only origin main
```

Older releases wrote generated sitemap dates into the tracked source file. If that is the only local change blocking the first pull, preserve it in a stash before updating:

```bash
git stash push -m "legacy generated sitemap" -- build-your-best/public/sitemap.xml
git pull --ff-only origin main
```

Do not discard other VPS changes without reviewing them first. New builds write only to ignored `dist` output and will not recreate this conflict.

Install exact locked packages, restart the API, and rebuild:

```bash
cd /var/www/bybs/bybs/backend
npm ci --omit=dev
cd ..
pm2 startOrReload ecosystem.config.cjs --env production

cd build-your-best
npm ci
npm run build

sudo nginx -t
sudo systemctl reload nginx
```

Do not run the Vite development server or expose the Node API port publicly in production.

## 7. Backups And Rollback

Before a release, confirm a recent MongoDB backup and preserve the previous frontend `dist` directory or deployment revision. If a release fails, check out the prior known-good commit, run both `npm ci` steps again, rebuild, and use `pm2 startOrReload`.

Cloudinary media and MongoDB data are not stored in this repository and need their own retention policies.
