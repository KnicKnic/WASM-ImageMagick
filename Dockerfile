FROM trzeci/emscripten:sdk-tag-1.38.12-64bit
# FROM trzeci/emscripten@sha256:65c7bfc84c38f2f5d11d36296a715e0c5e3c36f58a08d9ef3dfc74425d05e860
# trzeci/emscripten:sdk-tag-1.38.6-64bit is the sha above

# trzeci/emscripten:sdk-tag-1.38.11-64bit is the first releaase that doesnt pass

RUN apt-get update -y
RUN apt-get install -y autoconf libtool shtool autogen pkg-config