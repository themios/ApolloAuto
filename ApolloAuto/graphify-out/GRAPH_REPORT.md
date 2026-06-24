# Graph Report - /home/tim/Applications/Websites/ApolloAuto  (2026-06-20)

## Corpus Check
- 18 files · ~43,288 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 109 nodes · 165 edges · 17 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `getDb()` - 14 edges
2. `setSourceMode()` - 8 edges
3. `normalizeTheme()` - 7 edges
4. `loadList()` - 6 edges
5. `loadThemeEditor()` - 6 edges
6. `setMode()` - 6 edges
7. `setContent()` - 6 edges
8. `main()` - 5 edges
9. `api()` - 5 edges
10. `openEditor()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `getThemeSettings()` --calls--> `normalizeTheme()`  [INFERRED]
  /home/tim/Applications/Websites/ApolloAuto/db.js → /home/tim/Applications/Websites/ApolloAuto/lib/theme.js
- `saveThemeSettings()` --calls--> `normalizeTheme()`  [INFERRED]
  /home/tim/Applications/Websites/ApolloAuto/db.js → /home/tim/Applications/Websites/ApolloAuto/lib/theme.js
- `updateEditorFields()` --calls--> `setMode()`  [INFERRED]
  /home/tim/Applications/Websites/ApolloAuto/admin/admin.js → /home/tim/Applications/Websites/ApolloAuto/admin/html-editor.js
- `openEditor()` --calls--> `setContent()`  [INFERRED]
  /home/tim/Applications/Websites/ApolloAuto/admin/admin.js → /home/tim/Applications/Websites/ApolloAuto/admin/html-editor.js
- `themePayload()` --calls--> `normalizeTheme()`  [INFERRED]
  /home/tim/Applications/Websites/ApolloAuto/server.js → /home/tim/Applications/Websites/ApolloAuto/lib/theme.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (18): api(), buildColorFields(), checkSession(), escapeHtml(), fillThemeForm(), formatDate(), loadList(), loadThemeEditor() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.26
Nodes (15): deletePost(), getDb(), getPostById(), getPostBySlug(), getThemeSettings(), initDb(), listPosts(), savePost() (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.37
Nodes (12): ensureQuill(), getContent(), normalizeHtml(), plainField(), plainWrap(), setContent(), setMode(), setSourceMode() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (6): themePayload(), getFontPair(), googleFontsUrl(), normalizeTheme(), themeCssVariables(), validateTheme()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (2): startAutoplay(), stopAutoplay()

### Community 5 - "Community 5"
Cohesion: 0.6
Nodes (5): build_manifest(), main(), redact_page(), render_pages(), save_pdf()

### Community 6 - "Community 6"
Cohesion: 0.4
Nodes (2): start(), stop()

### Community 7 - "Community 7"
Cohesion: 0.6
Nodes (3): blogCard(), escapeHtml(), itemHtml()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (2): docCard(), escapeHtml()

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (2): card(), escapeHtml()

### Community 10 - "Community 10"
Cohesion: 0.83
Nodes (3): card(), escapeHtml(), postUrl()

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 12`** (2 nodes): `rebuild-sqlite.js`, `resolveNodeExecutable()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `post.js`, `escapeHtml()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `theme-loader.js`, `applyTheme()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `ensure-admin.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `view.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `normalizeTheme()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `openEditor()` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `setContent()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `normalizeTheme()` (e.g. with `themePayload()` and `getThemeSettings()`) actually correct?**
  _`normalizeTheme()` has 3 INFERRED edges - model-reasoned connections that need verification._