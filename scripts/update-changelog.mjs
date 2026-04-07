import fs from 'fs/promises';
import path from 'path';

const root = path.resolve();
const changelogPaths = [path.join(root, 'CHANGELOG.md'), path.join(root, 'CHANGELOG')];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildDefaultChangelog(version, date) {
  return [
    '# Changelog',
    '',
    'All notable changes to this project are documented in this file.',
    '',
    '## [Unreleased]',
    '',
    `## [${version}] - ${date}`,
    '- Initial changelog entry.',
    '',
  ].join('\n');
}

function addVersionEntry(content, version, date) {
  const versionHeader = `## [${version}] - ${date}`;
  if (content.includes(versionHeader)) {
    return null;
  }

  const lines = content.split(/\r?\n/);
  const unreleasedIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === '## [unreleased]',
  );
  const insertAt = unreleasedIndex >= 0 ? unreleasedIndex + 1 : lines.length;

  const entry = ['', versionHeader, '- Release notes to be added.', ''];

  lines.splice(insertAt, 0, ...entry);
  return lines.join('\n');
}

async function main() {
  const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  const version = packageJson.version || '0.0.0';
  const date = formatDate(new Date());

  const existingPath =
    (
      await Promise.all(changelogPaths.map(async (p) => ({ path: p, exists: await fileExists(p) })))
    ).find((item) => item.exists)?.path || changelogPaths[0];

  let content = '';
  if (await fileExists(existingPath)) {
    content = await fs.readFile(existingPath, 'utf8');
  }

  if (!content.trim()) {
    const defaultChangelog = buildDefaultChangelog(version, date);
    await fs.writeFile(existingPath, defaultChangelog, 'utf8');
    console.log(`Created changelog at ${path.basename(existingPath)} with version ${version}.`);
    return;
  }

  const updated = addVersionEntry(content, version, date);
  if (updated === null) {
    console.log(`Changelog already contains version ${version}.`);
    return;
  }

  await fs.writeFile(existingPath, updated, 'utf8');
  console.log(`Updated changelog at ${path.basename(existingPath)} with version ${version}.`);
}

main().catch((error) => {
  console.error('Failed to update changelog:', error);
  process.exit(1);
});
