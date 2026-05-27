# Buyer documents (PDFs)

Drop PDF files here for the **Buyer Guides** page at `/resources/`.

## Deal paperwork library (`contract-sections/`)

The folder `documents/contract-sections/` holds **redacted copies** of actual Apollo deal forms split by section (DMV, financing contract pages, disclosures). They are generated from a source contract PDF:

```bash
# Place source scan at the path in scripts/process-contract.py, then:
.venv-pdf/bin/python3 scripts/process-contract.py
```

This rewrites the PDFs and `contract-sections/manifest.json`. Customer names, VINs, amounts, and signatures are whited out; form layout is preserved from the scan.

**Not included:** vehicle history reports, checks, or other deal-specific third-party pages.

## Add a new document

1. **Upload your PDF** to this folder, e.g. `documents/contract-walkthrough.pdf`
   - Use lowercase names with hyphens (no spaces).
   - Keep file sizes reasonable (under ~5 MB when possible).

2. **Register it** in `resources/documents.json`:

```json
{
  "id": "contract-walkthrough",
  "category": "paperwork",
  "title": "Purchase paperwork walkthrough",
  "description": "What each major document is for before you sign.",
  "file": "../documents/contract-walkthrough.pdf",
  "url": null,
  "comingSoon": false
}
```

3. **Refresh the site.** If you use `npm start`, reload `/resources/`. No rebuild needed.

## Categories

| ID | Use for |
|----|---------|
| `before-visit` | Checklists, what to bring, first visit |
| `financing` | Credit, applications, payments |
| `paperwork` | Contracts, disclosures, glossary |
| `trade-in` | Trade-in process and prep |
| `after-purchase` | Registration, insurance, after-sale |

## Online article instead of PDF

Set `"url"` to a blog link and leave `"file"` null:

```json
"file": null,
"url": "../blog/post.html?slug=bad-credit-financing",
"comingSoon": false,
"linkLabel": "Read online"
```

## Remove “Coming soon”

Set `"comingSoon": false` and provide either `"file"` (PDF) or `"url"` (web page).

## Note

These materials are for customer education. They are not legal advice. Have your contracts and disclosures reviewed by qualified counsel for your dealership.
