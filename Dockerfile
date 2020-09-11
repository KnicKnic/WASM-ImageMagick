FROM emscripten/emsdk:2.0.0

# #use latest due to jessie being retired
# FROM trzeci/emscripten

# #seems image is stilll jessie, lets copy this workaround I found at https://unix.stackexchange.com/questions/508724/failed-to-fetch-jessie-backports-repository
# RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
# RUN sed -i '/deb http:\/\/http.debian.net\/debian jessie-backports main/d' /etc/apt/sources.list
# RUN cat /etc/apt/sources.list
# RUN cat /etc/apt/sources.list.d/jessie-backports.list
# RUN apt-get -o Acquire::Check-Valid-Until=false update


# work around broken time in linux containers on windows
RUN apt-get  -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false  update -y

# RUN apt-get update -y
RUN apt-get install -y autoconf libtool shtool autogen pkg-config
