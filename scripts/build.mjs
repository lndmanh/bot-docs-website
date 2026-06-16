import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'build');
const filesToCopy = [
  'index.html',
  '404.html',
  'styles.css',
  'app.js',
  'robots.txt',
  'CNAME',
  '.nojekyll',
];

const mappedCopies = [
  {
    source: 'static/img/favicon.ico',
    destination: 'favicon.ico',
  },
];

const cleanOnly = process.argv.includes('--clean');

async function copyFile(fileName) {
  const sourcePath = path.join(rootDir, fileName);
  const targetPath = path.join(outputDir, fileName);

  try {
    await fs.copyFile(sourcePath, targetPath);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

async function main() {
  await fs.rm(outputDir, { recursive: true, force: true });

  if (cleanOnly) {
    return;
  }

  await fs.mkdir(outputDir, { recursive: true });

  for (const fileName of filesToCopy) {
    await copyFile(fileName);
  }

  for (const { source, destination } of mappedCopies) {
    try {
      await fs.copyFile(path.join(rootDir, source), path.join(outputDir, destination));
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        continue;
      }

      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});