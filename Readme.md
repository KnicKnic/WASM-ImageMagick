```
git clone --recurse-submodules https://github.com/KnicKnic/WASM-ImageMagick.git

#docker run --rm -it --workdir /code -v "$PWD":/code trzeci/emscripten bash

apt-get update -y
apt-get install -y autoconf libtool shtool autogen pkg-config
./build.sh

```