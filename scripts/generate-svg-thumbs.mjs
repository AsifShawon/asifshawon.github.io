import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectDataPath = join(process.cwd(), 'src', 'app', 'hello', 'projects', 'projectData.json');
const assetsDir = join(process.cwd(), 'public', 'assets');

function escapeXml(str) {
  const s = String(str ?? '');
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function svgContent({ title, bg }) {
  const safeTitle = escapeXml(title);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="#222831" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00000055"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <g filter="url(#shadow)">
    <rect x="80" y="80" rx="24" ry="24" width="1040" height="640" fill="#0B1C23AA" stroke="#93B1A6" stroke-width="3" />
  </g>
  <text x="600" y="420" text-anchor="middle" fill="#EAF0F1" font-family="'Inter', system-ui, -apple-system, Segoe UI, Roboto" font-size="72" font-weight="700">
    ${safeTitle}
  </text>
  <text x="600" y="500" text-anchor="middle" fill="#C8D6E5" font-family="'Inter', system-ui" font-size="28" font-weight="500">Project Preview</text>
</svg>`;
}

async function run() {
  const raw = await readFile(projectDataPath, 'utf-8');
  const data = JSON.parse(raw);

  await Promise.all(data.map(async (p) => {
    const fileName = `project-${p.id}.svg`;
    const outPath = join(assetsDir, fileName);
    const content = svgContent({ title: p.projectTitle ?? 'Untitled Project', bg: p.backgroundColor || '#222831' });
    await writeFile(outPath, content, 'utf-8');
    console.log(`Generated ${outPath}`);
  }));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
