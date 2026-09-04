---
name: release
description: Create a new package release with version bump, GitHub release, and npm publish trigger
disable-model-invocation: true
argument-hint: [patch|minor|major]
---

Create a new package release for @box-kite/react.

## Steps

1. **Pre-flight checks**
   - Run `npm run compile` to verify type check passes
   - Run `npm test` to verify all tests pass
   - Confirm you are on the `main` branch and it is clean and up to date with origin

2. **Version bump**
   - Run `npm version $ARGUMENTS` (defaults to `patch` if no argument provided)
   - This creates a version commit and a git tag automatically

3. **Push**
   - Push the commit and tag: `git push origin main --follow-tags`

4. **Gather changelog context**
   - Find the previous release tag: `gh release list --limit 1`
   - Get all commits since the last release: `git log <previous-tag>..HEAD --oneline`
   - Get all merged PRs since the last release: `gh pr list --state merged --search "merged:>YYYY-MM-DD"`
   - Read the commit messages and PR titles to understand all changes

5. **Create GitHub release** using the format below
   - The release title is the plain version number (e.g. `3.2.0`), no "v" prefix
   - The tag is `v<version>` (e.g. `v3.2.0`)

6. **Confirm** the release was created and share the URL

## The 1.0.0 rename release, once only

These steps belong to the first release under the new name and to no other. Delete this section after it.

- **Trusted publishing is per package.** `publish.yml` publishes whatever name is in `dist/package.json`,
  but npm's OIDC config binds to a _package_. `@box-kite/react` needs its own trusted-publisher entry
  (repo `box-kite/box-kite`, workflow `publish.yml`) before the release, or the publish 403s.
- **The compatibility bridge is published by hand**, because it is a different package: after the
  release, `npm run build` then `npm run build:bridge`, then `npm publish ./dist-bridge --access public`.
- **Then deprecate the old name** — the bridge is what stops a build breaking; this is what moves people:
  `npm deprecate @cronocode/react-box "renamed: npm i @box-kite/react"`.
- **Link the migration page** (<https://box-kite.dev/migrating/>) from the release notes, and list the
  two DOM id changes and the type-augmentation string as the breaking surface.

## Release Notes Format

````markdown
## Highlights

One or two sentence summary of the most notable changes in this release.

### 🚀 Features

- **ComponentOrPropName**: Description of what was added ([#PR](url))
  ```tsx
  // Optional: short code example if it helps illustrate usage
  ```
````

### 🐛 Bug Fixes

- **ComponentOrPropName**: Description of what was fixed ([#PR](url))

### ⚡ Performance

- Description of performance improvement ([#PR](url))

### 📦 Other Changes

- Dependency updates, refactoring, docs ([#PR](url))

---

**Full Changelog**: https://github.com/box-kite/box-kite/compare/<previous-tag>...<new-tag>

```

## Format Rules

- Only include sections that have entries (skip empty sections)
- **Bold the component or prop name** at the start of each bullet
- Link every item to its PR
- Include short code examples for new features when they help illustrate usage
- Keep descriptions concise — one line per item
- The "Highlights" section is always present
- End with a Full Changelog compare link
```
