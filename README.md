# Bot Noname static site

This repository now ships a plain static site for GitHub Pages.

The deployed output is generated into `build/` with:

```
npm run build
```

The page is designed as a migration shell. It keeps old paths intact, then redirects them to `https://nnsvn.me/botnoname` on the client side.

Important: GitHub Pages cannot emit true server-side 301 or 308 redirects for arbitrary slugs. If you need search-engine-grade migration behavior, the industry-correct option is to host the old domain behind a redirect-capable edge such as Cloudflare, Netlify, or a server you control.
