import { backup, DatabaseSync } from 'node:sqlite';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = '/backups';
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
const destination = join(root, stamp);
await mkdir(destination);

const source = new DatabaseSync('/data/app.db', { readOnly: true });
try {
  await backup(source, join(destination, 'app.db'));
} finally {
  source.close();
}

await cp('/data/images', join(destination, 'images'), { recursive: true });
const snapshot = new DatabaseSync(join(destination, 'app.db'), { readOnly: true });
const integrity = snapshot.prepare('PRAGMA quick_check').get().quick_check;
snapshot.close();
if (integrity !== 'ok') throw new Error('Backup database integrity check failed');

const names = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{8}T\d{6}Z$/.test(entry.name))
  .map((entry) => entry.name)
  .sort()
  .reverse();
for (const name of names.slice(14)) {
  const target = resolve(root, name);
  if (!target.startsWith(resolve(root) + '/')) throw new Error('Invalid backup path');
  await rm(target, { recursive: true });
}

console.log(`Backup ${stamp}: database integrity ok`);
