# Security Policy

## Supported versions

Security fixes are applied to the latest minor of the current major version.

| Version | Supported |
| ------- | --------- |
| 3.x     | ✅        |
| < 3.0   | ❌        |

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Use GitHub's private vulnerability reporting: [Report a vulnerability](https://github.com/cronocodesolutions/react-box/security/advisories/new). You should receive an acknowledgement within 7 days.

Once a fix is available we will publish a patched release and credit the reporter in the release notes (unless you prefer to stay anonymous).

## Scope notes

react-box is a styling library that injects CSS at runtime. Reports we consider in scope include (but are not limited to):

- CSS injection through prop values (e.g. a crafted prop value escaping a generated rule)
- Prototype pollution or global-scope mutation reachable from the published entries
- Supply-chain issues in the published artifact (unexpected files, scripts, or dependencies)
