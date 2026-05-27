# Graph Report - /home/tim/ApolloWebsite  (2026-05-27)

## Corpus Check
- 12 files · ~33,796 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 58 nodes · 78 edges · 12 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `getDb()` - 10 edges
2. `loadList()` - 6 edges
3. `main()` - 5 edges
4. `savePost()` - 4 edges
5. `api()` - 4 edges
6. `selectPost()` - 4 edges
7. `openEditor()` - 4 edges
8. `getPostById()` - 3 edges
9. `escapeHtml()` - 3 edges
10. `card()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (10): api(), checkSession(), escapeHtml(), formatDate(), loadList(), openEditor(), selectPost(), showApp() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (11): deletePost(), getDb(), getPostById(), getPostBySlug(), initDb(), listPosts(), savePost(), seedAdmin() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.6
Nodes (5): build_manifest(), main(), redact_page(), render_pages(), save_pdf()

### Community 3 - "Community 3"
Cohesion: 0.6
Nodes (3): blogCard(), escapeHtml(), itemHtml()

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (2): docCard(), escapeHtml()

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (2): card(), escapeHtml()

### Community 6 - "Community 6"
Cohesion: 0.83
Nodes (3): card(), escapeHtml(), postUrl()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 9`** (2 nodes): `post.js`, `escapeHtml()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `rebuild-sqlite.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `view.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._