# Roadmap — react-enhanced-image

Aktuálna verzia: `0.1.0` (pripravená na publish)

---

## Stav po posledných opravách

- [x] rAF batching canvas redraws (`useCanvasCrop.ts`)
- [x] Oddelenie načítania obrázka od prekresľovania
- [x] Wheel throttling cez rAF (`Canvas.tsx`)
- [x] Oprava priamej mutácie Zustand stavu (`canvasRef.ts`)
- [x] Mention sticker typ — `@username` pill na canvase
- [x] Location sticker typ — červená bodka + text pill

---

## 1. Pred prvým publishom — blocker veci ✅ HOTOVO

### package.json
- [x] Odstrániť `"private": true`
- [x] Pridať `"peerDependencies"` — react, react-dom, zustand
- [x] Pridať `"files": ["dist"]`
- [x] Pridať `"license"`, `"description"`, `"keywords"`
- [x] Presunúť react/react-dom/zustand do devDependencies
- [ ] Overiť názov balíka `react-enhanced-image` na npmjs.com

### Kvalita kódu
- [x] `src/constants.ts` — `ZOOM_STEP`, `TOUCH_ZOOM_STEP`, `ZOOM_MIN`, `ZOOM_MAX`, `RESIZE_HANDLE_SIZE`
- [x] Odstrániť mŕtvy/zakomentovaný kód (`useStickers.ts`, `useCanvas.ts`)
- [x] Opraviť `Record<string, any>` → `Record<string, unknown>` v `StickerInput.payload`
- [x] Opraviť preklep v `vite.config.ts`: `ReactEnahncedImage` → `ReactEnhancedImage`
- [x] Pridať `zustand` do `rollupOptions.external`

### Error handling
- [x] Try/catch pri SVG parsovaní (`useStickers.ts`)
- [x] `onerror` handler pri načítaní base image (`useCanvasCrop.ts`)
- [x] Zoom clamp aj pri wheel (`Canvas.tsx`)

---

## 2. Verzionovanie — semver

Používame **semantic versioning**: `MAJOR.MINOR.PATCH`

| Typ zmeny | Verzia |
|-----------|--------|
| Bug fix, oprava performance | PATCH (`1.0.x`) |
| Nová feature, spätne kompatibilná | MINOR (`1.x.0`) |
| Breaking change v API | MAJOR (`x.0.0`) |

### Odporúčaný workflow
```bash
# 1. Všetky zmeny commitnuté, testy zelené
# 2. Bump verzie (manuálne alebo npm version)
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# 3. npm version automaticky vytvorí git tag (v1.0.1)
# 4. Push so tagmi
git push && git push --tags

# 5. Publish
npm publish
```

### Prvý publish — odporúčaná verzia
Keďže API ešte nie je stabilné → začať na `0.1.0` (signalizuje "beta").
Až po stabilizácii API → `1.0.0`.

---

## 3. Publish na npm registry

### Jednorazové nastavenie
```bash
# Registrácia / prihlásenie
npm login

# Overiť či si prihlásený
npm whoami

# Overiť balík pred publishom (dry run)
npm publish --dry-run
```

### Každý release
```bash
pnpm build          # generuje dist/ + typy
npm version patch   # bump + git tag
git push && git push --tags
npm publish
```

### Scoped balík (ak chceš `@tvoje-meno/react-enhanced-image`)
```json
// package.json
{
  "name": "@ssedlak/react-enhanced-image",
  "publishConfig": { "access": "public" }
}
```
```bash
npm publish --access public
```

---

## 4. Ďalšie features (post-publish)

### v0.2.0
- [x] Undo/redo — `zundo` temporal middleware, `partialize` len stickers, pause/resume pri dragu ✅
- [x] Mention sticker typ ✅
- [x] Location sticker typ ✅

### v0.3.0
- [x] Keyboard shortcuts — ⌘Z/⌘⇧Z undo/redo, Delete/Backspace, Escape, ⌘C/V/D ✅
- [x] Copy/paste + duplicate sticker (⌘C, ⌘V, ⌘D) ✅
- [x] Image filtre — brightness + contrast slidery, `ctx.filter` v canvase ✅

### Neskôr / nice-to-have
- [ ] Storybook dokumentácia
- [ ] Unit testy (vitest) pre hook logiku
- [ ] GitHub Actions CI — build + publish on tag

---

## 5. CI/CD (GitHub Actions) — voliteľné

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  push:
    tags: ["v*"]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: pnpm install
      - run: pnpm build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Potrebuješ: `NPM_TOKEN` secret v GitHub repo settings (z `npm token create`).

---

## Rýchly checklist pre prvý publish

```
[ ] npm whoami (si prihlásený? → npm login ak nie)
[x] Odstrániť "private": true z package.json
[x] Presunúť react/react-dom/zustand do peerDependencies
[x] Pridať "files": ["dist"]
[x] Overiť názov balíka na npmjs.com — react-enhanced-image je voľný ✅
[x] tsconfig.lib.json — typegen len zo src/, bez demo/
[x] Opraviť types path v package.json (dist/types/index.d.ts)
[x] Exports field — types pred import/require
[x] README.md prepísaný so správnym API
[x] pnpm build — OK, 26.9kB ES / 18.7kB UMD, 19 súborov
[x] npm publish --dry-run — OK ✅
[ ] npm login
[ ] npm publish
[ ] git push && git push --tags
```
