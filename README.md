# Electron Build Script

This script is used by me to automate the obfuscation + build process for some of my electron apps

# What does it do?

1. Cleans your dist folder
2. Obfuscates your JavaScript files in your selected source folders
3. Checks for dependencies in your package.json file which should be listed under devDependencies
4. Builds the electron app with the local electron-builder installation
5. Makes a hard git reset (So you can continue working with your non-obfuscated files)


# Usage

Copy this file in your project and add it as script in your package.json, for example: 
```
"scripts": {
  "build": "node build/build.js"
},
```
Install the needed dependencies: [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator/), [fs-extra](https://github.com/jprichardson/node-fs-extra) and [electron-builder](https://github.com/electron-userland/electron-builder)

Edit some variables to fit your environment/needs: 
  - dist folder (line 6)
  - javascript-obfuscator config (lines 26-30)
  - dev dependencies (line 37)
  
Run it with: `npm run build js/ classes/ --win --mac --linux`
And it will try to build for all 3 platforms, if it's possible (Only on mac AFAIK)


## Planned additions:
I am currently not working that much with electron anymore so don't expect any improvements, this is more an archive than anything else.

## Authors
* **Jonas Scholz** - [Code42Cate](https://github.com/Code42Cate)

## License

This project is licensed under the MIT License
