/**
 * Build verification.
 *
 * The jest integration suite proves the *source* entry point is complete. This proves the
 * *published* one is: that every advertised entry file exists, that a real consuming app
 * typechecks against the generated declarations, and that nothing in the build reaches back into
 * source paths a consumer will not have. It runs against lib/, after `bob build`, and in CI.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

// 1 — every advertised entry point exists.
for (const field of ['main', 'module', 'types']) {
  const value = pkg[field];
  check(Boolean(value), `package.json has no "${field}" field`);
  if (value) {
    check(existsSync(join(root, value)), `"${field}" points at a missing file: ${value}`);
  }
}

// 2 — the exports map resolves to real files.
const exportEntry = pkg.exports?.['.'];
check(Boolean(exportEntry), 'package.json has no "." entry in exports');
for (const [condition, value] of Object.entries(exportEntry ?? {})) {
  check(existsSync(join(root, value)), `exports["."].${condition} is missing: ${value}`);
}

// 3 — a miniature consuming app typechecks against the BUILT declarations.
//     This is the real test of the published types: it fails if a component is exported from
//     source but missing from the build, or if a type only resolves through an internal path.
if (existsSync(join(root, 'lib/typescript'))) {
  const consumer = spawnSync('npx', ['tsc', '-p', 'scripts/consumer/tsconfig.json'], {
    cwd: root,
    encoding: 'utf8',
    shell: true,
  });
  if (consumer.status !== 0) {
    failures.push('the consumer typecheck failed against lib/typescript:');
    failures.push((consumer.stdout || consumer.stderr || '').trim());
  }
} else {
  failures.push('lib/typescript was not generated');
}

// 4 — the brand rules survive the build: no filled-red button variant reaches consumers.
const buttonTypes = join(root, 'lib/typescript/src/atoms/BaconButton.d.ts');
if (existsSync(buttonTypes)) {
  const buttonDeclarations = readFileSync(buttonTypes, 'utf8');
  check(
    !/["']danger["']|["']destructive["']/.test(buttonDeclarations),
    'BaconButton declarations expose a danger/destructive variant',
  );
}

// 5 — the CJS build does not import from src/, which is not what consumers resolve.
if (pkg.main && existsSync(join(root, pkg.main))) {
  const cjs = readFileSync(join(root, pkg.main), 'utf8');
  check(!cjs.includes('../src/'), 'the commonjs build reaches back into src/');
}

if (failures.length > 0) {
  console.error('Package verification failed:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Package verification passed (${pkg.name}@${pkg.version}).`);
