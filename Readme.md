```
git clone --recurse-submodules https://github.com/KnicKnic/WASM-ImageMagick.git

docker build -t wasm-imagemagick-build-tools .

docker run --rm -it --workdir /code -v "$PWD":/code wasm-imagemagick-build-tools bash ./build.sh

```