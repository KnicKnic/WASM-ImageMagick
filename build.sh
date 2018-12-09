export CPPFLAGS="-I/code/libpng -I/code/zlib -I/code/libjpeg -I/code/libtiff/libtiff"
export LDFLAGS="-L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/libtiff/libtiff"
export MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1"
export CFLAGS="-O3 $CPPFLAGS $MAKE_FLAGS"
export CXXFLAGS="$CFLAGS"
export EM_BUILD_VERBOSE=1
export PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
export PNG_LIBS="-L/code/libpng -L/code/libpng/.libs"

cd /code/zlib
emconfigure ./configure --prefix=. --static  
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 
emcmake make install

cd /code/libjpeg
autoreconf -fvi
emconfigure ./configure --prefix=. --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 
emcmake make install


cd /code/libpng
libtoolize
# aclocal
autoreconf
automake --add-missing
# ./autogen
emconfigure ./configure --prefix=. --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS"
emcmake make install


cd /code/libtiff
libtoolize --force
###
aclocal
###
autoreconf --force
#### 
automake --add-missing
./autogen
autoconf
autoreconf
####
emconfigure ./configure --prefix=. --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS"
emcmake make install


cd /code/ImageMagick
autoconf
# echo "\n\nPKG_CONFIG_PATH: $PKG_CONFIG_PATH \n\n"
emconfigure ./configure --prefix=./prefix --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x \
  --disable-largefile --disable-openmp --without-bzlib --without-dps --without-jbig --without-openjp2 --without-lcms --without-wmf \
  --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib \
  --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp \
  --without-xml PKG_CONFIG_PATH="$PKG_CONFIG_PATH"
echo "
 ImageMagick configure exit code: $?
"

# include emscripten freetype port and its includes files. 
# heads up - there are some unresolved symbols on link so we need to use emscripten setting -s ERROR_ON_UNDEFINED_SYMBOLS=0 
export MAKE_FLAGS="$MAKE_FLAGS -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s USE_FREETYPE=1 -s USE_HARFBUZZ=1"
export CPPFLAGS="$CPPFLAGS -I$HOME/.emscripten_ports/freetype/FreeType-version_1/include"
export PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"

emcmake make CFLAGS="$CFLAGS $CPPFLAGS"
echo "
 ImageMagick 'make' exit code: $?
"

emcmake make install
echo "
 ImageMagick 'make install' exit code: $?
"

# produce the correct output file
rm -rf utilities/magick.{wasm,js} 
./libtool --silent --tag=CC --mode=link emcc -verbose $MAKE_FLAGS $CXXFLAGS -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -o utilities/magick.html utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la
echo "
 ImageMagick link exit code: $?
"
