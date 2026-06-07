# Hostinger VPS Production Deployment

This project has two deployable parts:

- `backend`: Node/Express API, usually kept running with PM2.
- `build-your-best`: Vite React public/admin frontend, built once and served as static files by Nginx.

## 1. Server Prerequisites

Install Node.js 20+, Nginx, PM2, and Git on the VPS.

```bash
node -v
npm -v
sudo npm install -g pm2
```

## 2. Backend Environment

Copy the backend env template and fill in production values:

```bash
cd /var/www/bybs/backend
cp .env.example .env
nano .env
```

Required production values:

- `NODE_ENV=production`
- `MONGO_URI`
- `FRONTEND_URL=https://yourdomain.com`
- `CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`
- `JWT_SECRET` with a long random value
- `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY`, `FROM_EMAIL`, and `ADMIN_EMAIL`
- Cloudinary keys if uploads are used

## 3. Frontend Environment

Copy the frontend env template and fill in production values before building:

```bash
cd /var/www/bybs/build-your-best
cp .env.example .env
nano .env
```

Use the public site API path when Nginx proxies `/api` to the backend:

```bash
VITE_API_URL=https://yourdomain.com/api
VITE_PAYSTACK_PUBLIC_KEY=pk_live_or_test_key
```

## 4. Install And Build

Backend:

```bash
cd /var/www/bybs/backend
npm ci --omit=dev
pm2 start src/server.js --name bybs-api
pm2 save
pm2 startup
```

Frontend:

```bash
cd /var/www/bybs/build-your-best
npm ci
npm run build
```

The static frontend output will be in:

```bash
/var/www/bybs/build-your-best/dist
```

## 5. Nginx Site Config

Create an Nginx config for the domain:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/bybs/build-your-best/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5002/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5002/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Add SSL from Hostinger's panel or Certbot, then confirm the site redirects to HTTPS.

## 6. Paystack Webhook

Set the Paystack webhook URL to:

```text
https://yourdomain.com/api/payments/webhook
```

Use matching live keys when switching from test mode to live payments.

## 7. Production Checks

After deployment, check:

```bash
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/articles
pm2 logs bybs-api
```

Then test the public flows in the browser:

- Home page
- Charity merch page
- Ebook checkout
- Merch checkout
- Contact form
- Admin login

## 8. Updating The Site

Pull the latest code, rebuild the frontend, and restart the API:

```bash
cd /var/www/bybs
git pull

cd backend
npm ci --omit=dev
pm2 restart bybs-api

cd ../build-your-best
npm ci
npm run build
```
