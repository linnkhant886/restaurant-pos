const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app/backoffice');
let count = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Match any action={FunctionName}
  // Make sure not to match if it already has "as any"
  const regex = /action=\{([A-Za-z0-9_]+)\}/g;
  if (regex.test(content)) {
    content = content.replace(regex, 'action={$1 as any}');
    fs.writeFileSync(f, content);
    count++;
  }
});

console.log('Fixed files:', count);
