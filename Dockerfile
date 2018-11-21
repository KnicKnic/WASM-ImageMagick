FROM trzeci/emscripten:sdk-tag-1.38.19-64bit

RUN apt-get update -y
RUN apt-get install -y autoconf libtool shtool autogen pkg-config