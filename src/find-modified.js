const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== 'node_modules' && f !== '.next' && f !== '.git') {
      walkDir(dirPath, callback);
    } else if (!isDirectory) {
      callback(dirPath);
    }
  });
}

const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
const modifiedFiles = [];

walkDir(path.join(__dirname, '..'), (filePath) => {
  const stats = fs.statSync(filePath);
  if (stats.mtimeMs > sevenDaysAgo) {
    modifiedFiles.push({
      path: path.relative(path.join(__dirname, '..'), filePath),
      mtime: stats.mtime
    });
  }
});

modifiedFiles.sort((a, b) => b.mtime - a.mtime);
fs.writeFileSync(path.join(__dirname, 'modified.json'), JSON.stringify(modifiedFiles, null, 2));
