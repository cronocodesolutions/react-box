// Fails the build if a code snippet the docs site shows does not compile.
//
// Every component page presents an example twice: the live demo is real JSX inside the page, so
// TypeScript already checks it, and the code block beside it is a *string* — hand-written, and
// until now read by nobody. That is how the homepage shipped a responsive example with the `sm`
// prop written twice and the Grid page documented a `colSpan` prop that does not exist (bug #15).
//
// The strings are compiled the way a reader would compile them: against the published specifiers
// (`@cronocode/react-box/components/flex`), not the repo-relative paths the pages themselves
// import, and *without* `pages/box.d.ts` — the docs site extends Box with its own props and
// component variants, and a snippet that only type-checks because of that augmentation is a
// snippet that would not type-check for the person copying it.
//
// A snippet is a fragment rather than a module, so it gets exactly three allowances:
//   - the components and hooks it uses are imported for it, unless it imports them itself;
//   - a *lowercase* name it never declares is something the page around it owns (`data`, `users`)
//     and becomes `any`. Capitalised names are never declared away: a component that does not
//     resolve is the mistake this check exists to catch;
//   - `context` on the `<Code>` element adds declarations that are compiled but not displayed —
//     for the handful of blocks whose surrounding data has a *shape* a generic component infers
//     from (a DataGrid over `any` resolves its row type to `object`, and every cell access fails).
//
// Blocks that are deliberately not compilable code — a CSS listing, an outline with `...` in it,
// two files shown at once — say so with `check={false}`, which reads in the page source as the
// claim it is.
//
// Run: npm run check:docs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const root = join(import.meta.dirname, '..');
const PAGES = 'pages';

/**
 * Which JSX elements carry a snippet, and how the page renders the string it holds. `DemoCard`
 * (boxPage.tsx) documents a *prop fragment* and shows it inside a Box, so the check wraps it the
 * same way the page does.
 */
const SNIPPET_TAGS = {
  Code: (code) => code,
  DemoCard: (code) => `<Box ${code}>content</Box>`,
};

/** Snippets in these languages are not TypeScript, so there is nothing here to compile. */
const NOT_TYPESCRIPT = new Set(['shell', 'css']);

/** The published entry points, resolved to the sources they are built from. */
const PACKAGE_PATHS = {
  '@cronocode/react-box': ['src/box.ts'],
  '@cronocode/react-box/a11y': ['src/a11y.ts'],
  '@cronocode/react-box/core': ['src/core.ts'],
  '@cronocode/react-box/rsc': ['src/rsc.ts'],
  '@cronocode/react-box/ssg': ['src/ssg.ts'],
  '@cronocode/react-box/types': ['src/types.ts'],
  '@cronocode/react-box/components/*': ['src/components/*'],
};

/**
 * What a snippet may use without importing it — one import statement per name, so a snippet that
 * writes its own import for something keeps its own and gets no duplicate.
 */
const PROVIDED = {
  React: "import * as React from 'react';",
  useCallback: "import { useCallback } from 'react';",
  useEffect: "import { useEffect } from 'react';",
  useMemo: "import { useMemo } from 'react';",
  useRef: "import { useRef } from 'react';",
  useState: "import { useState } from 'react';",
  BaseSvg: "import BaseSvg from '@cronocode/react-box/components/baseSvg';",
  Box: "import Box from '@cronocode/react-box';",
  Button: "import Button from '@cronocode/react-box/components/button';",
  Checkbox: "import Checkbox from '@cronocode/react-box/components/checkbox';",
  DataGrid: "import DataGrid from '@cronocode/react-box/components/dataGrid';",
  Dropdown: "import Dropdown from '@cronocode/react-box/components/dropdown';",
  Flex: "import Flex from '@cronocode/react-box/components/flex';",
  Form: "import Form from '@cronocode/react-box/components/form';",
  Grid: "import Grid from '@cronocode/react-box/components/grid';",
  Overlay: "import Overlay from '@cronocode/react-box/components/overlay';",
  RadioButton: "import RadioButton from '@cronocode/react-box/components/radioButton';",
  RadioGroup: "import RadioGroup from '@cronocode/react-box/components/radioGroup';",
  Select: "import Select from '@cronocode/react-box/components/select';",
  Switch: "import Switch from '@cronocode/react-box/components/switch';",
  Textarea: "import Textarea from '@cronocode/react-box/components/textarea';",
  Textbox: "import Textbox from '@cronocode/react-box/components/textbox';",
  Tooltip: "import Tooltip from '@cronocode/react-box/components/tooltip';",
  VisuallyHidden: "import VisuallyHidden from '@cronocode/react-box/components/visuallyHidden';",
  // The SVG elements — one entry each, so a drawing in a snippet reads as a drawing would.
  Circle: "import { Circle } from '@cronocode/react-box/components/svg';",
  ClipPath: "import { ClipPath } from '@cronocode/react-box/components/svg';",
  Defs: "import { Defs } from '@cronocode/react-box/components/svg';",
  Ellipse: "import { Ellipse } from '@cronocode/react-box/components/svg';",
  G: "import { G } from '@cronocode/react-box/components/svg';",
  Line: "import { Line } from '@cronocode/react-box/components/svg';",
  LinearGradient: "import { LinearGradient } from '@cronocode/react-box/components/svg';",
  Marker: "import { Marker } from '@cronocode/react-box/components/svg';",
  Mask: "import { Mask } from '@cronocode/react-box/components/svg';",
  Path: "import { Path } from '@cronocode/react-box/components/svg';",
  Polygon: "import { Polygon } from '@cronocode/react-box/components/svg';",
  Polyline: "import { Polyline } from '@cronocode/react-box/components/svg';",
  RadialGradient: "import { RadialGradient } from '@cronocode/react-box/components/svg';",
  Rect: "import { Rect } from '@cronocode/react-box/components/svg';",
  Stop: "import { Stop } from '@cronocode/react-box/components/svg';",
  Svg: "import { Svg } from '@cronocode/react-box/components/svg';",
  SvgSymbol: "import { SvgSymbol } from '@cronocode/react-box/components/svg';",
  SvgText: "import { SvgText } from '@cronocode/react-box/components/svg';",
  TSpan: "import { TSpan } from '@cronocode/react-box/components/svg';",
  Use: "import { Use } from '@cronocode/react-box/components/svg';",
};

/** A name TypeScript could not find is the page's own context — but only if it is a value. */
const MISSING_NAME = /Cannot find name '([^']+)'/;

/** "JSX expressions must have one parent element": the snippet shows sibling elements, as docs do. */
const NEEDS_FRAGMENT = 2657;

/** Every `.tsx` file under `pages/`, as a repo-relative POSIX path. */
function walk(dir) {
  const out = [];

  for (const name of readdirSync(join(root, dir))) {
    const path = `${dir}/${name}`;

    if (statSync(join(root, path)).isDirectory()) out.push(...walk(path));
    else if (path.endsWith('.tsx')) out.push(path);
  }

  return out;
}

function attribute(element, name, source) {
  const found = element.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.getText(source) === name);

  return found?.initializer;
}

/** The literal a `code`/`language`/`context` attribute holds, unwrapping the `{…}` JSX adds. */
function literalOf(initializer) {
  if (!initializer) return undefined;

  const node = ts.isJsxExpression(initializer) ? initializer.expression : initializer;

  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node;

  return undefined;
}

/** Every snippet a page displays, with the position of the string that holds it. */
function collectSnippets(path) {
  const text = readFileSync(join(root, path), 'utf8');
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];

  visit(source);

  return found;

  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const wrap = SNIPPET_TAGS[node.tagName.getText(source)];

      if (wrap) {
        const language = literalOf(attribute(node, 'language', source))?.text ?? 'jsx';
        const code = literalOf(attribute(node, 'code', source));
        const check = attribute(node, 'check', source);
        const optedOut = check && ts.isJsxExpression(check) && check.expression?.kind === ts.SyntaxKind.FalseKeyword;
        const line = ts.getLineAndCharacterOfPosition(source, node.getStart(source)).line + 1;

        if (NOT_TYPESCRIPT.has(language)) found.push({ path, line, skipped: language });
        else if (optedOut) found.push({ path, line, skipped: 'opted out' });
        // No `code` at all means the block is printed from the live demo beside it, which is real
        // JSX in the page and so already checked by `npm run compile`. A template with a
        // substitution in it is assembled at runtime — boxPage builds one from the DemoCard
        // fragment this check reads at the call site instead.
        else if (!attribute(node, 'code', source)) found.push({ path, line, skipped: 'rendered from the demo' });
        else if (!code) found.push({ path, line, skipped: 'assembled at runtime' });
        else {
          // +1 for the opening quote or backtick: the content starts right after it, so that
          // position is the snippet's own line 1.
          const start = ts.getLineAndCharacterOfPosition(source, code.getStart(source) + 1);
          const context = literalOf(attribute(node, 'context', source))?.text;

          found.push({ path, line: start.line + 1, code: wrap(code.text), context });
        }
      }
    }

    ts.forEachChild(node, visit);
  }
}

/** The names a snippet declares for itself — imports, variables, functions, classes, types. */
function declaredNames(code) {
  const source = ts.createSourceFile('snippet.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = new Set();

  const addBinding = (name) => {
    if (!name) return;
    if (ts.isIdentifier(name)) names.add(name.text);
    else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
      for (const element of name.elements) if (ts.isBindingElement(element)) addBinding(element.name);
    }
  };

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause) {
      const { name, namedBindings } = statement.importClause;

      if (name) names.add(name.text);
      if (namedBindings && ts.isNamespaceImport(namedBindings)) names.add(namedBindings.name.text);
      if (namedBindings && ts.isNamedImports(namedBindings)) for (const e of namedBindings.elements) names.add(e.name.text);
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) addBinding(declaration.name);
    } else if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name) {
      names.add(statement.name.text);
    } else if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      names.add(statement.name.text);
    }
  }

  return names;
}

/**
 * A snippet as a module: what it needs imported, what the page around it owns, then the snippet
 * itself. Each generated line remembers which snippet line it came from, so a diagnostic can be
 * reported at the line of the page the reader would edit.
 */
function moduleFor(snippet, { free, fragment }) {
  const declared = declaredNames(snippet.code);
  const lines = [];
  const add = (text, from = null) => lines.push({ text, from });

  for (const [name, statement] of Object.entries(PROVIDED)) if (!declared.has(name)) add(statement);
  for (const line of (snippet.context ?? '').split('\n')) if (line.trim()) add(line);
  for (const name of free) add(`declare const ${name}: any;`);

  // Docs show sibling elements with no wrapper all the time; TypeScript wants one root. Only the
  // snippets that asked for it are wrapped, so a leading comment stays a comment everywhere else.
  if (fragment) add('const jsx = (<>');
  snippet.code.split('\n').forEach((text, index) => add(text, index + 1));
  if (fragment) add('</>);');

  return { text: lines.map((l) => l.text).join('\n'), lines };
}

function compilerOptions() {
  const { config } = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, root);

  return { ...options, baseUrl: root, paths: { ...options.paths, ...PACKAGE_PATHS }, noEmit: true, skipLibCheck: true, types: [] };
}

/** One program over every snippet at once — the sources they import are parsed once for all of them. */
function compile(modules, options) {
  const host = ts.createCompilerHost(options, true);
  const original = { getSourceFile: host.getSourceFile, fileExists: host.fileExists, readFile: host.readFile };

  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    const virtual = modules.get(fileName);

    return virtual
      ? ts.createSourceFile(fileName, virtual.text, languageVersion, true, ts.ScriptKind.TSX)
      : original.getSourceFile.call(host, fileName, languageVersion, ...rest);
  };
  host.fileExists = (fileName) => modules.has(fileName) || original.fileExists.call(host, fileName);
  host.readFile = (fileName) => modules.get(fileName)?.text ?? original.readFile.call(host, fileName);

  const program = ts.createProgram([...modules.keys()], options, host);
  const diagnostics = [];

  for (const fileName of modules.keys()) {
    const file = program.getSourceFile(fileName);

    diagnostics.push(...program.getSyntacticDiagnostics(file), ...program.getSemanticDiagnostics(file));
  }

  return diagnostics;
}

const all = walk(PAGES).flatMap(collectSnippets);
const snippets = all.filter((s) => s.code !== undefined);
const skipped = all.filter((s) => s.skipped);
const options = compilerOptions();
const name = (index) => `snippet-${index}.tsx`;
const state = new Map(snippets.map((_, index) => [name(index), { free: new Set(), fragment: false }]));
const build = () => new Map(snippets.map((s, index) => [name(index), moduleFor(s, state.get(name(index)))]));

// The first pass asks what the page around each snippet owns, and which snippets show sibling
// elements; the second declares the one, wraps the other, and judges what is left.
for (const diagnostic of compile(build(), options)) {
  const found = state.get(diagnostic.file.fileName);
  const [, missing] = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ').match(MISSING_NAME) ?? [];

  if (!found) continue;
  if (diagnostic.code === NEEDS_FRAGMENT) found.fragment = true;
  if (missing && /^[a-z_$]/.test(missing)) found.free.add(missing);
}

const modules = build();
const failures = [];

for (const diagnostic of compile(modules, options)) {
  const index = Number(diagnostic.file.fileName.match(/snippet-(\d+)\.tsx/)[1]);
  const snippet = snippets[index];
  const at = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start ?? 0);
  const from = modules.get(diagnostic.file.fileName).lines[at.line]?.from;

  failures.push({
    // A diagnostic on a generated line belongs to the block as a whole, not to a line of it.
    where: `${snippet.path}:${from ? snippet.line + from - 1 : snippet.line}`,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
    source: diagnostic.file.text.split('\n')[at.line]?.trim(),
  });
}

if (failures.length) {
  console.error(`\n✖ ${failures.length} error(s) in the code the docs site shows:\n`);

  for (const failure of failures) {
    console.error(`  ${failure.where}  ${failure.message}`);
    console.error(`    ${failure.source}\n`);
  }

  console.error('Fix the snippet, or mark the block check={false} if it is deliberately not compilable code.\n');
  process.exit(1);
}

const reasons = skipped.reduce((counts, s) => counts.set(s.skipped, (counts.get(s.skipped) ?? 0) + 1), new Map());
const summary = [...reasons].map(([reason, count]) => `${count} ${reason}`).join(', ');

console.log(`✔ ${snippets.length} docs snippets compile against the published entry points (${summary || 'none skipped'})`);
