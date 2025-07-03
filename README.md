# XJ Project - TanStack Start Monorepo

A TypeScript monorepo with TanStack Start, Drizzle ORM, and Kenni OIDC authentication. Includes complete kennitala integration for Icelandic applications.

## ⚡ Quickstart for VS Code + Claude Code

This project uses a **host/container split architecture** for optimal development with Claude Code. The container provides isolation and consistency, while the host manages networking and tunnels.

### Prerequisites

- **VS Code** with Dev Containers extension
- **Docker Desktop** (for containerized development)  
- **Claude Code CLI** (for AI assistance)
- **Cloudflare CLI**: `brew install cloudflared` (for HTTPS tunnels on host)

### Architecture Overview

**🖥️ HOST handles:**
- HTTPS tunnels (cloudflared)
- Docker container orchestration  
- Network routing to containers

**📦 CONTAINER handles:**
- Node.js/pnpm environment
- Vite development server
- Database connections
- Claude Code AI assistance

*Why this split?* - Containers provide isolated, consistent environments while hosts handle networking complexity. This enables secure Claude Code usage with `--dangerously-skip-permissions` in a sandboxed environment.*

### 1. Clone & Open in Container

```bash
git clone <repository-url>
cd xj-mono
code .
```

**Choose**: "Reopen in Container" when VS Code prompts. This will:
- Build the development container with Node.js 20 + pnpm + dev tools
- Start PostgreSQL database container automatically  
- Install dependencies and push database schema
- Launch Claude Code and shell

*Everything runs in containers - no local setup required!*

### 2. Start HTTPS Tunnel (Host)

**In a separate terminal ON YOUR HOST** (not in VS Code):

```bash
cd xj-mono
node host-tunnel.mjs
```

*Note: The tunnel and dev server can start in any order - the tunnel script waits for the dev server to be ready.*

This creates a public HTTPS URL that routes to the container's port 4200:
```
🎉 Tunnel ready! Hostname: abc-123.trycloudflare.com
✅ Updated VITE_HOSTNAME=abc-123.trycloudflare.com in web/.env file
```

*Why host-side tunnels?* - OAuth providers require public HTTPS URLs. Running cloudflared on the host avoids container networking complexity and ensures stable tunnel performance.*

### 3. Start Development (Container)

**In VS Code terminal** (inside container):

```bash
pnpm dev
```

This starts Vite on port 4200 with:
- ⚡ **Hot reload** enabled
- 🔄 **Container→Host→Tunnel** routing  
- 🔧 **All development tools** available

**Traffic Flow:**
```
Browser → abc-123.trycloudflare.com → Host:4200 → Container:4200 → Vite
```

### 5. Configure OAuth Redirect (One-time)

Add your tunnel URL to Kenni settings:
1. **Kenni Dashboard** → Your app → Settings  
2. **Allowed redirect URIs** → Add:
   ```
   https://abc-123.trycloudflare.com/api/auth/callback
   ```

*Pro tip: Tunnel URLs change on restart. For production-like development, consider a stable tunnel or custom domain.*

### 6. Launch Claude Code (Securely)

```bash
# Inside VS Code container terminal:
claude --dangerously-skip-permissions
```

*Why in container?* - The `--dangerously-skip-permissions` flag is safe here because Claude operates in an isolated container environment, not your host system.*

### 🎉 You're Ready!

- **Local dev**: `http://localhost:4200` (hot reload)
- **Public HTTPS**: `https://abc-123.trycloudflare.com` (OAuth-ready)  
- **Database UI**: `pnpm db:studio` (visual editor)
- **AI Assistant**: Claude Code with full codebase access

**Test it**: Visit your tunnel URL and click "Login with Kenni" - you should see the full OAuth flow working.

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

| Command                       | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| `pnpm dev`                    | **Start dev server** (in container)                   |
| `pnpm build`                  | Build all packages for production                     |
| `pnpm lint` / `pnpm lint:fix` | Run/fix linting (oxlint)                              |
| `pnpm type-check`             | TypeScript compilation check                          |
| `node host-tunnel.mjs`        | Start HTTPS tunnel (run on host)                     |

### Database Commands (from packages/db)

| Command                         | Description                            |
| ------------------------------- | -------------------------------------- |
| `cd packages/db && pnpm db:studio` | Open visual database browser           |
| `cd packages/db && pnpm db:push`   | Push schema changes to database        |
| `cd packages/db && pnpm db:generate` | Generate migrations                    |
| `cd packages/db && pnpm db:migrate`  | Run migrations                         |

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
# Check if containers are running
docker ps

# Rebuild devcontainer (includes database)
# In VS Code: Command Palette → "Dev Containers: Rebuild Container"

# Or manually recreate database
docker exec xj-mono-devcontainer-db-1 psql -U postgres -c "DROP DATABASE IF EXISTS xj; CREATE DATABASE xj;"
cd packages/db && pnpm db:push
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

- Database runs on port **5434** (configurable in `.devcontainer/docker-compose.yml`)
- Dev server runs on port **4200** (configurable in `web/vite.config.ts`)

**Authentication errors:**

- Verify Kenni credentials in `.env`
- Check that `VITE_HOSTNAME` matches your tunnel URL
- Ensure tunnel URL is registered in Kenni dashboard

### Getting Help

1. Check if all containers are running: `docker ps`
2. Verify environment variables are set correctly in `web/.env`
3. Check container logs: `docker logs <container-name>`
4. Restart devcontainer: VS Code → "Dev Containers: Rebuild Container"

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
