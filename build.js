const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs-extra');
const { execFile } = require('child_process');

console.log('Cleaning dist folder...');
fs.emptyDirSync('dist');

const dirs = [];
const targets = [];
for (let index = 2; index < process.argv.length; index += 1) {
  if (process.argv[index].startsWith('--')) {
    targets.push(process.argv[index]);
  } else {
    dirs.push(process.argv[index]);
  }
}
console.log('Building for:');
targets.forEach(target => console.log(target.substring(2)));

// obfuscate files
dirs.forEach((dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const path = `${dir}${file}`;
    console.log(`Obfuscating: ${path}`);
    const obfuscated = JavaScriptObfuscator.obfuscate(fs.readFileSync(path), {
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      selfDefending: true,
      disableConsoleOutput: true,
    }).getObfuscatedCode();
    fs.writeFileSync(path, obfuscated);
  });
});

// check for dependencies that should be dev dependencies
const devDependencies = ['electron', 'electron-builder'];
const packageJson = fs.readJSONSync('package.json');
devDependencies.forEach((dep) => {
  if (packageJson.dependencies[dep] !== undefined) {
    packageJson.devDependencies[dep] = packageJson.dependencies[dep];
    delete packageJson.dependencies[dep];
  }
});
fs.writeJSONSync('package.json', packageJson, { spaces: 2 }); // Update package.json with changed dependencies

// build with electron-builder
const electronBuilder = execFile('node', ['./node_modules/.bin/electron-builder'].concat(targets), (error, stdout, stderr) => {
  if (error) {
    console.error('stderr', stderr);
    throw error;
  }
  console.log('stdout', stdout);
});
electronBuilder.on('exit', () => { // Wait for electron builder to finish
  // use git to reset the changes on branch
  execFile('git', ['reset', '--hard'], (error, stdout, stderr) => {
    if (error) {
      console.error('stderr', stderr);
      throw error;
    }
    console.log('stdout', stdout);
  });
});
