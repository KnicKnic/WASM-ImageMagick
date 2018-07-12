FROM trzeci/emscripten

RUN apt-get update -y
RUN apt-get install -y autoconf libtool shtool autogen pkg-config