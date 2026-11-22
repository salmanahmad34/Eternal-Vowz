---
name: eternal-vowz-guardrails
description: Official privacy, security, crawler governance, and pre-commit verification guardrails for Eternal Vowz.
---

# Eternal Vowz Engineering & Privacy Guardrails

> **Target Platform:** Eternal Vowz (`https://eternal-vowz.onrender.com`)  
> **Founder / Lead Developer:** Salman Ahmad  
> **Scope:** Privacy compliance, crawler protection, repository security, build verification, and truthful marketing.

---

## Part 1: Privacy & Crawler Governance Guardrails

### 1.1 Customer Wedding Invitation Privacy (`/invite/[slug]`)
- **Strict Noindex:** Every invitation page (`/invite/[slug]`) belongs to private families. It MUST always have `robots: { index: false, follow: false, nocache: true, noarchive: true, googleBot: { index: false, follow: false, noimageindex: true } }`.
- **No Canonical Tags on Dynamic Invitations:** Never place a canonical tag pointing search engines to a private customer wedding URL.
- **Disallowed in robots.ts:** The path `/invite/` MUST be explicitly disallowed in `src/app/robots.ts` for all crawlers (`*` and AI bots).
- **Excluded from Sitemaps and AI Documentation:** No customer `/invite/[slug]` URL may ever be listed in `sitemap.xml`, `sitemap.ts`, `public/llms.txt`, or `public/llms-full.txt`.

### 1.2 Web Crawler & AI Engine Policy
- **Blocked Crawlers:** Aggressive scrapers like `Bytespider` and `ByteDance` MUST be explicitly blocked in `robots.ts` with `disallow: ['/']`.
- **Permitted AI Engines:** `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Amazonbot`, and `Applebot-Extended` are permitted ONLY on public marketing and informational pages (`/`, `/about`, `/guide`, `/contact`, `/refund`, `/shipping`, `/terms`, `/privacy`, `/llms.txt`, `/llms-full.txt`).

---

## Part 2: Repository Security & `.gitignore` Guardrails

The following file patterns must NEVER be tracked in Git:

1. **Environment & Secrets:**
   - `.env`, `.env*.local`, `.env.production` (ONLY `.env.example` with dummy values is permitted).
   - Certificates and private keys: `*.key`, `*.pem`, `*.crt`, `*.cert`, `*.pfx`, `*.p12`, `*.keystore`, `id_rsa*`, `id_ed25519*`.
2. **Database & Customer Data:**
   - Dumps and databases: `*.dump`, `*.sqlite`, `*.sqlite3`, `*.db`.
   - SQL dumps: `*.sql` (with strict exception only for tracked migration schemas: `!supabase/schema.sql`, `!supabase/auth_rls_hardening.sql`).
   - Customer spreadsheets or records: `*.csv`, `*.xlsx`, `/exports/`, `/customer-data/`, `/guest-exports/`.
3. **Temporary & Scratch Artifacts:**
   - `/scratch/`, `/tmp/`, `/temp/`, `*.tmp`, `*.temp`, `*.log`, `*.swp`.

---

## Part 3: Mandatory Pre-Commit & Pre-Push Checklist

Before EVERY Git commit and push, run the following verification steps and inspect real command outputs:

- [ ] **Checklist Item 1 — Untracked Secrets Audit:**
  ```powershell
  python -c "import subprocess; files = subprocess.check_output(['git', 'ls-files'], text=True).splitlines(); print([f for f in files if any(k in f for k in ['.env', '.key', '.pem', '.dump', '.sqlite']) if f != '.env.example'])"
  ```
  *Requirement:* Must return `[]` (empty list).

- [ ] **Checklist Item 2 — Customer Invite Privacy Verification:**
  ```powershell
  Select-String -Path "src/app/sitemap.ts", "public/llms.txt", "public/llms-full.txt" -Pattern "/invite/"
  ```
  *Requirement:* Must return zero matches.

- [ ] **Checklist Item 3 — Robots Crawler Rules Verification:**
  - `Bytespider` must have `disallow: ['/']`.
  - `/invite/` must be in `disallow` for all user agents.

- [ ] **Checklist Item 4 — Clean Production Build:**
  ```powershell
  npm run build
  ```
  *Requirement:* Must complete fully with exit code 0. If it fails, report "verify nahi hua".

---

## Part 4: Data & Narrative Integrity Guardrail

- **Zero Fabricated Content:** Never invent, hallucinate, or assume any pricing, customer testimonials, review ratings, user counts, discounts, or founder background stories.
- **Mandatory Clarification:** If any fact or copy is unknown, ask Salman Ahmad directly rather than making assumptions.
- **Current Canonical Facts:**
  - **Price:** Flat ₹99 INR (one-time fee per card).
  - **Hosting / Validity:** Card 30 Days tak active rahega with live RSVP tracking.
  - **Signature Suites:** 8 designs (Pearl Botanical Veil, Shahi Palace Gates, Tuscan Sunset Rose, Royal Mughal Arch, Celestial Starlight, Kashmir Chinar Lotus, Shahi Crimson & Zari, Jodhpur Sapphire Darbar).
  - **Founder:** Salman Ahmad (B.Tech student from Azamgarh, Uttar Pradesh).
  - **Support Contact:** `mrsalman7307@gmail.com`.
