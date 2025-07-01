# XJ Project - TanStack Start Monorepo

A TypeScript monorepo with TanStack Start, Drizzle ORM, and Kenni OIDC authentication. Includes complete kennitala integration for Icelandic applications.

## ⚡ Quickstart

Get up and running in 5 minutes:

### Prerequisites

- **Node.js 18+** and **pnpm**: `npm install -g pnpm`
- **Docker**: For PostgreSQL database
- **Cloudflare CLI**: `brew install cloudflared` (for tunnels)

### 1. Setup Project

```bash
# Clone and install
git clone <repository-url>
cd xj-mono
pnpm install

# Copy environment template
cp web/.env.example web/.env
```

### 2. Configure Environment

Edit `web/.env` with your settings:

```bash
# Generate secure secrets (run these commands):
SESSION_SECRET="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 32)"

# Add your Kenni credentials:
KENNI_CLIENT_ID=your-kenni-client-id
KENNI_CLIENT_SECRET=your-kenni-client-secret
KENNI_ISSUER_URL=https://idp.kenni.is/your-domain
```

### 3. Start Development

```bash
# One command starts everything:
pnpm dev
```

This will:

1. 🐘 **Start PostgreSQL** in Docker container
2. 🏗️ **Create database tables** automatically
3. 🌐 **Launch tunnel** with public HTTPS URL
4. 📝 **Update .env** with tunnel hostname
5. ⚡ **Start dev server** on port 4200

### 4. Configure Kenni (Required for Auth)

Watch the console output for your tunnel URL like:

```
🎉 Tunnel ready! Hostname: abc-123.trycloudflare.com
```

**Important**: Add this to your Kenni application settings:

1. Go to Kenni dashboard → Your app → Settings
2. Find "Allowed redirect URIs"
3. Add:

   ```
   https://abc-123.trycloudflare.com/api/auth/callback
   ```

4. Save settings

### 5. You're Ready! 🎉

- **Local app**: <http://localhost:4200>
- **Public tunnel**: `https://your-tunnel.trycloudflare.com`
- **Database**: `pnpm db:studio` (visual database browser)

Test authentication by clicking "Login with Kenni" and authenticating with your kennitala.

---

## 📦 Project Structure

```text
xj-mono/
├── web/                      # TanStack Start application
│   ├── src/
│   │   ├── routes/           # File-based routing
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities and auth
│   └── scripts/              # Development scripts
├── packages/
│   ├── db/                   # Drizzle ORM + PostgreSQL
│   ├── kenni/               # Kenni OIDC authentication
│   └── utils/               # Shared utilities
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | **Start everything** (database + tunnel + dev server) |
| `pnpm db:up` | Start PostgreSQL database only |
| `pnpm db:studio` | Open visual database browser |
| `pnpm --filter=web dev:local` | Start dev server without tunnel |
| `pnpm build` | Build all packages for production |
| `pnpm lint` / `pnpm lint:fix` | Run/fix linting (oxlint) |
| `pnpm type-check` | TypeScript compilation check |

### Database Commands

| Command | Description |
|---------|-------------|
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:generate` | Generate migrations (from packages/db) |
| `pnpm db:migrate` | Run migrations (from packages/db) |
| `pnpm db:down` | Stop PostgreSQL container |

## 🔐 Authentication with Kenni

### What is Kenni?

Kenni is an OIDC authentication service for Iceland, similar to BankID in other Nordic countries. It allows users to authenticate using their kennitala (Icelandic national ID).

### Authentication Flow

1. User clicks "Login with Kenni"
2. Redirected to Kenni identity provider
3. User authenticates with their kennitala
4. Kenni redirects back with authorization code
5. Application exchanges code for user information
6. User is logged in with JWT session

### Available Auth Helpers

```typescript
import { requireServerUser, requireServerAdminUser } from "~/lib/server-auth";

// Require authenticated user
const { session, user } = await requireServerUser();

// Require admin user
const { session, user } = await requireServerAdminUser();
```

## 🌐 Smart Tunnel Development

The project includes intelligent tunnel management for development:

### Why Tunnels?

OAuth providers (like Kenni) require **public HTTPS URLs** for callbacks. During development, you need:

- Public URLs for testing authentication flows
- Consistent hostnames for OAuth redirect URIs
- HTTPS for secure cookie handling

### How It Works

1. **Cloudflare Tunnel**: Creates a public HTTPS URL → `https://abc-123.trycloudflare.com`
2. **Auto-Detection**: Script monitors tunnel output and extracts hostname
3. **Environment Update**: Automatically sets `VITE_HOSTNAME` in `.env`
4. **Vite Restart**: Dev server picks up the new hostname

**🔑 Important**: You need to add your tunnel URL to Kenni's allowed redirect URIs:

1. Go to your Kenni application settings
2. Find "Allowed URIs that Kenni can redirect back to after a successful authentication"
3. Add your tunnel URL with the callback path:
   ```
   https://your-tunnel-hostname.trycloudflare.com/api/auth/callback
   ```
4. Separate multiple URIs with a new line (useful for multiple developers)

The tunnel URL changes each time you restart, so you may need to update this setting frequently during development. For a more stable setup, consider using a fixed tunnel or ngrok with a custom domain.

### Manual Tunnel (if needed)

```bash
# If automatic tunnel fails, run manually:
cloudflared tunnel --url http://localhost:4200

# Copy the generated hostname and add to .env:
echo "VITE_HOSTNAME=your-tunnel-hostname.trycloudflare.com" >> web/.env
```

## 📊 Database

### Schema Overview

- **`user`**: User accounts with kennitala integration
- **`kenni_login`**: Authentication audit log
- **`email`**: Email management and templates

### Key Features

- 🔑 **CUID2 IDs** for collision-resistant identifiers
- 📊 **Indexed queries** for performance
- 🔗 **Foreign key constraints** with cascade deletes
- ⏰ **Automatic timestamps** (createdAt, modifiedAt)
- 🛡️ **Role-based access** (user, admin)

### Database Access

```bash
# Connect to database directly
docker exec -it xj-postgres psql -U postgres -d xj

# View all tables
\dt

# View table structure
\d user
```

## 🎯 Technology Stack

### Frontend
- **TanStack Start** - React meta-framework with SSR
- **TanStack Router** - Type-safe file-based routing
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first styling
- **React Aria Components** - Accessible UI components

### Backend
- **TanStack Start Server Functions** - Type-safe server-side logic
- **Drizzle ORM** - Type-safe SQL toolkit
- **PostgreSQL 16** - Reliable database
- **JWT Sessions** - Secure authentication with @oslojs/jwt

### Development
- **Turbo** - Fast build system and task runner
- **oxlint** - Ultra-fast Rust-based linter
- **TypeScript 5** - Type safety across the stack
- **Docker** - Containerized PostgreSQL

## 🚨 Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Check if container is running
docker ps

# Restart database
pnpm db:down && pnpm db:up

# Recreate database and tables
docker exec xj-postgres psql -U postgres -c "DROP DATABASE IF EXISTS xj; CREATE DATABASE xj;"
pnpm db:push
```

**Tunnel not working:**
```bash
# Install cloudflared if missing
brew install cloudflared

# Check if tunnel is blocked
cloudflared tunnel --url http://localhost:4200

# Manually set hostname in .env if auto-detection fails
```

**Port conflicts:**
- Database runs on port **5434** (configurable in `packages/db/docker-compose.yml`)
- Dev server runs on port **4200** (configurable in `web/vite.config.ts`)

**Authentication errors:**
- Verify Kenni credentials in `.env`
- Check that `VITE_HOSTNAME` matches your tunnel URL
- Ensure tunnel URL is registered in Kenni dashboard

### Getting Help

1. Check if all containers are running: `docker ps`
2. Verify environment variables are set correctly
3. Check logs: `pnpm db:logs` for database issues
4. Restart everything: `pnpm dev`

## 📝 Environment Variables Reference

### Required (Server-only)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/xj
SESSION_SECRET="32-character-secret"
JWT_SECRET="32-character-secret"
KENNI_CLIENT_ID=your-kenni-client-id
KENNI_CLIENT_SECRET=your-kenni-client-secret
KENNI_ISSUER_URL=https://idp.kenni.is/your-domain
```

### Optional
```bash
POSTMARK_SERVER_API_TOKEN=your-postmark-token  # For email sending
NODE_ENV=development                            # Environment mode
```

### Client-side (Public)
```bash
VITE_HOSTNAME=your-tunnel-hostname.com         # Auto-set by tunnel script
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm type-check && pnpm lint`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.