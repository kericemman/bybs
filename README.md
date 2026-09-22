# Build Your Best Self

BYBS is a full-stack platform for the organisation's public website and internal administration.

## Current Capabilities

- Fellowship cohorts, applications, screening, invitations, and regret emails
- Articles with rich text, images, video embeds, authors, newsletters, and live reader counts
- Community actions, reflections, testimonials, participation, and impact stories
- Products, merchandise support requests, and order follow-up through the BYBS team
- Admin and limited manager roles with permission-based access
- Cloudinary media storage, Resend email delivery, and MongoDB persistence

The website does not collect payment. Shop and support requests are saved for admin follow-up through the official BYBS contact channels.

## Applications

- `build-your-best`: React and Vite frontend
- `backend`: Express and MongoDB API
- `deploy/nginx`: production reverse-proxy configuration
- `ecosystem.config.cjs`: PM2 process definition

Node.js 22 LTS is recommended. Copy each `.env.example` to `.env` and replace every placeholder before starting the applications.

```bash
cd backend
npm ci
npm run dev
```

```bash
cd build-your-best
npm ci
npm run dev
```

For the Hostinger VPS production procedure, security checks, Nginx setup, and routine update commands, see [DEPLOYMENT.md](./DEPLOYMENT.md).
