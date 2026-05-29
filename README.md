# Customer Websites

Monorepo for client website projects. Each customer gets a top-level folder with their site code, assets, and deployment config.

**Local path:** `/home/tim/Applications/Websites`  
**Remote:** https://github.com/themios/websites

## Structure

```
websites/
├── ApolloAuto/          # Apollo Auto — apolloauto.us
├── CustomerName/        # future customer sites
└── README.md
```

## Customers

| Folder | Business | Live site |
|--------|----------|-----------|
| `ApolloAuto/` | Apollo Auto (Simi Valley & El Monte) | [apolloauto.us](https://www.apolloauto.us) |

## Working on a site

```bash
cd /home/tim/Applications/Websites/ApolloAuto   # or whichever customer folder
nvm use
npm install            # required after clone
npm run rebuild:native # if needed for your Node version
npm start
```

## Adding a new customer

1. Create a new folder at the repo root (e.g. `AcmeDealer/`).
2. Add a row to the table above.
3. Keep each customer's dependencies and env files inside their folder (`.env` is gitignored).
