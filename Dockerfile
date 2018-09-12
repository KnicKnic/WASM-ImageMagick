FROM trzeci/emscripten:sdk-tag-1.38.6-64bit
# the latest trzeci/emscripten produces binaries that do not work
# trzeci/emscripten:sdk-tag-1.38.6-64bit is the sha above

RUN apt-get update -y
RUN apt-get install -y autoconf libtool shtool autogen pkg-config