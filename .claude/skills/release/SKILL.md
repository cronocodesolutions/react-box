---
name: release
description: Create a new package release with version bump, GitHub release, and npm publish trigger
disable-model-invocation: true
argument-hint: [patch|minor|major]
---

Create a new package release for @cronocode/react-box.

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

## Release Notes Format

```markdown
## Highlights

One or two sentence summary of the most notable changes in this release.

### 🚀 Features

- **ComponentOrPropName**: Description of what was added ([#PR](url))
  ```tsx
  // Optional: short code example if it helps illustrate usage
  ```

### 🐛 Bug Fixes

- **ComponentOrPropName**: Description of what was fixed ([#PR](url))

### ⚡ Performance

- Description of performance improvement ([#PR](url))

### 📦 Other Changes

- Dependency updates, refactoring, docs ([#PR](url))

---

**Full Changelog**: https://github.com/cronocodesolutions/react-box/compare/<previous-tag>...<new-tag>
```

## Format Rules

- Only include sections that have entries (skip empty sections)
- **Bold the component or prop name** at the start of each bullet
- Link every item to its PR
- Include short code examples for new features when they help illustrate usage
- Keep descriptions concise — one line per item
- The "Highlights" section is always present
- End with a Full Changelog compare link
