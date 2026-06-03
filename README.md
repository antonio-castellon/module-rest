# @acastellon/rest

REST (HTTPS) based in Express, with integrated security (helmet, hpp), CORS, auth (via @acastellon/auth for NTLM/JWT), static serving (optional with cache).

Depends on sibling modules for auth/cors/vcs.

**Note:** Depends on `@acastellon/connect-static` (not in this module-* set, may be custom/external).

## Install

```bash
npm install @acastellon/rest
```

## Usage

Provide SERVER and AUTH configs + an api module with getRouter(options).

See templates.

## License

MIT
