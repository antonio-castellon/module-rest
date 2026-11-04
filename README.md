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

## API / Module surface

`require('@acastellon/rest')(SERVER, AUTH, apiModule)` returns `{ run(cb?), app }`.

- `run(cb)`: Starts http or https server (based on CERTIFICATION_PATH in SERVER). Handles EADDRINUSE retry.
- `app`: The internal express app (for advanced use).

Key behaviors:
- Applies compression, helmet (CSP disabled), hpp, body parsers (50mb json), cookieParser, CORS, auth (NTLM or JWT).
- Optional static + cache via @acastellon/connect-static.
- Mounts /api from your apiModule.getRouter(options), plus /roles and /refresh endpoints.
- Global error handler returns 500 JSON.

The apiModule is expected to export `{ getRouter(options) }` that returns an express Router.

**Minimal example (self-contained with template api):**

```js
const express = require('express');
const restMod = require('@acastellon/rest');

// Minimal api module (see api.template.js)
const api = require('./api.template.js');

const SERVER = {
  PORT: 3000,
  WHITELIST: './whitelist',
  STATIC_PATH: null,
  CACHE: false
  // CERTIFICATION_PATH: '...' // uncomment for HTTPS
};

const AUTH = require('./config.auth.js'); // your auth config

const rest = restMod(SERVER, AUTH, api);

rest.run(() => {
  console.log('REST server running');
});
```

## License

MIT

## Notice and Disclaimer

NOTICE AND DISCLAIMER: This software automatically retrieves, accesses or interacts with external materials. Those retrieved materials are not distributed with this software and are governed solely by separate terms, conditions and licenses. You are solely responsible for finding, reviewing and complying with all applicable terms, conditions, and licenses, and for verifying the security, integrity and suitability of any retrieved materials for your specific use case. This software is provided "AS IS", without warranty of any kind. The author makes no representations or warranties regarding any retrieved materials, and assumes no liability for any losses, damages, liabilities or legal consequences from your use or inability to use this software or any retrieved materials. Use this software and the retrieved materials at your own risk.

External materials module-rest interacts with at run time:

- The services and clients you connect to it, under your agreements for those systems.
