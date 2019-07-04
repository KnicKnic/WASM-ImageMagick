export PREFIX="/code/.build"
export CPPFLAGS="-I$PREFIX/include -I$HOME/.emscripten_ports/freetype/FreeType-version_1/include"
export LDFLAGS="-L$PREFIX/lib"
export MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1"
export CFLAGS="-O3 $CPPFLAGS $MAKE_FLAGS"
export CXXFLAGS="$CFLAGS"
export EM_BUILD_VERBOSE="0"
export PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig"
export PNG_LIBS="$LDFLAGS"

# set -e  # exit when any command fails
# clean up $PREFIX folder on exit. On error prints the command that failed:
# trap 'export lastECode=$?; cleanUpAndLogError "$LINENO" "$BASH_COMMAND" "$lastECode"; exit $lastECode' SIGHUP SIGINT SIGQUIT ERR EXIT
# cleanUpAndLogError() {
#   rm -rf $PREFIX
#   if [ "$3" -ne "0" ]; then
#     # if [ "/code/ImageMagick/utilities/magick.wasm" -n "0" ]; then
#     echo "
# Exiting with error! 
# Command failed was: "$2"
# Line number: "$1"
# Script: "$(basename $0)""
#   fi
# }

# make sure we start without old objects and $PREFIX folder
rm -rf /code/ImageMagick/utilities/magick.{wasm,js} 
rm -rf /code/magick.{wasm,js} 
rm -rf $PREFIX
mkdir -p $PREFIX

#########################
# zlib
#########################

cd /code/zlib
emconfigure ./configure --prefix=$PREFIX --static 
emcmake make CFLAGS="$CFLAGS"
emcmake make install


#########################
# libjpeg
#########################

cd /code/libjpeg
autoreconf -fvi
emconfigure ./configure --prefix=$PREFIX --disable-shared
emcmake make CFLAGS="$CFLAGS $LDFLAGS"
emcmake make install


#########################
# libpng
#########################

cd /code/libpng
libtoolize
autoreconf
automake --add-missing
emconfigure ./configure --prefix=$PREFIX --disable-shared
emcmake make 
emcmake make install


#########################
# libtiff
#########################

cd /code/libtiff
libtoolize --force
aclocal
autoreconf --force
automake --add-missing
./autogen
autoconf
autoreconf
emconfigure ./configure --prefix=$PREFIX --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS"
emcmake make install


# #########################
# # ImageMagick
# #########################

cd /code/ImageMagick
autoconf
emcc -s USE_FREETYPE=1 --cflags # make sure freetype port works (we will use its includes folder)

emconfigure ./configure --prefix=$PREFIX --disable-shared --disable-docs \
  --without-threads --without-magick-plus-plus --without-perl --without-x \
  --disable-largefile --disable-openmp --without-bzlib --without-dps --without-jbig \
  --without-openjp2 --without-lcms --without-wmf --without-xml --without-fftw --without-flif \
  --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib \
  --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw \
  --without-rsvg --without-webp \
  PKG_CONFIG_PATH="$PKG_CONFIG_PATH"

# Since including freetype causes unresolved symbols on link we use -s ERROR_ON_UNDEFINED_SYMBOLS=0 
export CFLAGS="$CFLAGS -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s USE_FREETYPE=1"
emcmake make CFLAGS="$CFLAGS"

emcmake make install

# produce the correct output file
./libtool --silent --tag=CC --mode=link emcc $LDFLAGS $CFLAGS -o utilities/magick.html utilities/magick.o \
  $PREFIX/lib/libMagickCore-7.Q16HDRI.la $PREFIX/lib/libMagickWand-7.Q16HDRI.la

