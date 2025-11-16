---
"chezmoi-ui": patch
"chezmoi-ui-client": patch
"chezmoi-ui-server": patch
---

Update vulnerable third-party dependencies to fix security issues:
- vite to 5.4.21 (fixes CVE-2024-45812, CVE-2024-45813, CVE-2024-45811)
- @changesets/cli to 2.29.7 (fixes cross-spawn, tmp, micromatch, @babel/runtime vulnerabilities)
- Added pnpm override for js-yaml to >=4.1.1 (fixes CVE-2025-64718)

All security vulnerabilities resolved (0 vulnerabilities reported by pnpm audit).
