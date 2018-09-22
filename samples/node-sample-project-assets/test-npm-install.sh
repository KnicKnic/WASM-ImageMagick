# this script creates a node.js project from scratch, install wasm-imagemagick with npm and use it to then generate a bundle.js that can be loaded in the browser. The idea is to simulate and document how this library can be used in a node.js development environment. 

rm -rf wasm-imagemagick*.tgz
npm pack # will generate installable .tgz identical to npmjs.org's 

PROJECT='sample-nodejs-project2'
rm -rf $PROJECT
mkdir -p $PROJECT

cp wasm-imagemagick*.tgz $PROJECT

cd $PROJECT
npm init -y

# install library and copy required files to current folder
npm install wasm-imagemagick*.tgz
cp node_modules/wasm-imagemagick/magick.wasm .
cp node_modules/wasm-imagemagick/magick.js .

# copy test assets
cp ../samples/node-sample-project-assets/* ../tests/rotate/FriedrichNietzsche.png .

# generate the bundle.js
npm install browserify
npx browserify indexCommonsJs.js -o bundle.js

# serve local files
echo "***  NAVIGATE TO http://127.0.0.1:8080 and you should see a working example ***"
npm install http-server
npx http-server .
