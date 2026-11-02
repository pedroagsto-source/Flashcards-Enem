// Renderiza quadros-chave como JPG para revisão: node stills.mjs 10 80 115 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const root = process.cwd();
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'ChipAdv', chromiumOptions: { gl: 'angle' }, browserExecutable: process.env.CHROME });
for (const f of process.argv.slice(2).map(Number)) {
  await renderStill({ serveUrl, composition, frame: f, output: path.join(root, `out/stills/${String(f).padStart(4, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, chromiumOptions: { gl: 'angle' }, browserExecutable: process.env.CHROME });
  console.log('still', f);
}
