// build-assets.js
// Gera versões minificadas simples de assets/styles.css -> assets/styles.min.css
// e assets/app.js -> assets/app.min.js sem dependências externas.

const fs = require('fs');
const path = require('path');

function minifyCSS(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\n+/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([{:;,}])\s*/g, '$1')
    .trim();
}

function minifyJS(src) {
  return src
    .replace(/\/\*[^]*?\*\//g, '') // remove block comments
    .replace(/\/\/.*$/gm, '') // remove line comments
    .replace(/\n+/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([=+\-*/{}();,:<>])\s*/g, '$1')
    .trim();
}

try {
  const assetsDir = path.join(__dirname, 'assets');

  // CSS
  const cssPath = path.join(assetsDir, 'styles.css');
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    const min = minifyCSS(css);
    fs.writeFileSync(path.join(assetsDir, 'styles.min.css'), min, 'utf8');
    console.log('Wrote assets/styles.min.css');
  } else console.warn('styles.css not found in assets/');

  // JS
  const jsPath = path.join(assetsDir, 'app.js');
  if (fs.existsSync(jsPath)) {
    const js = fs.readFileSync(jsPath, 'utf8');
    const minj = minifyJS(js);
    fs.writeFileSync(path.join(assetsDir, 'app.min.js'), minj, 'utf8');
    console.log('Wrote assets/app.min.js');
  } else console.warn('app.js not found in assets/');

} catch (err) {
  console.error('Error building assets', err);
  process.exit(1);
}
