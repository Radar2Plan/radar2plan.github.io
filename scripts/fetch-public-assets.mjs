import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputIndex = process.argv.indexOf('--output-dir');
if (outputIndex < 0 || !process.argv[outputIndex + 1]) {
  throw new Error('Provide --output-dir. Run on the Pages build runner; keep local bulk media in the research asset store.');
}
const outputRoot = path.resolve(process.argv[outputIndex + 1]);
const manifest = JSON.parse(await readFile(path.join(siteRoot, 'asset-manifest.json'), 'utf8'));
if (!/^[a-f0-9]{40}$/.test(manifest.commit)) throw new Error('Expected an immutable source commit.');

async function download(asset) {
  const destination = path.resolve(outputRoot, asset.path);
  if (!destination.startsWith(outputRoot + path.sep)) throw new Error('Asset path leaves output directory.');
  if (asset.size > 50 * 1024 * 1024) throw new Error('Asset exceeds the project file-size limit.');
  const url = `https://raw.githubusercontent.com/${manifest.repository}/${manifest.commit}/public/${asset.path}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${asset.path}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const blobHash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
      if (bytes.length !== asset.size || blobHash !== asset.git_blob_sha1) {
        throw new Error(`Asset verification failed: ${asset.path}`);
      }
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
      console.log(`Verified ${asset.path} (${bytes.length} bytes)`);
      return;
    } catch (error) {
      if (attempt === 3) throw error;
      console.warn(`Retry ${attempt}: ${asset.path}: ${error.message}`);
    }
  }
}

const queue = [...manifest.assets];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) await download(queue.shift());
}));
console.log(`Prepared ${manifest.assets.length} verified assets in ${outputRoot}`);
