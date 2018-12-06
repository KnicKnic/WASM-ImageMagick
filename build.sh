
# heads up : if pointing to freetype emscripten_ports then ld will warn about undefined symbols: error: undefined symbol: FT_Done_Face probably because is version 1. This doesn't happen if pointing to system freetype2: like `pkg-config --cflags freetype2` - pointing to emscripten_ports any way cause is safer. - emcc won't fail regardless undefined symbols:
export CPPFLAGS="-I/code/libpng -I/code/zlib -I/code/libjpeg -I/code/libtiff/libtiff `pkg-config --cflags freetype2` -I/code/libwebp/src"

export LDFLAGS="-L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/libtiff/libtiff -L/code/libwebp/ -L/code/libwebp/webp_js"

export CFLAGS="-O3"

export CXXFLAGS="$CFLAGS"

MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s USE_FREETYPE=1"

export PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"

export PNG_LIBS="-L/code/libpng -L/code/libpng/.libs"


cd /code/zlib
emconfigure ./configure --static
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 


cd /code/libjpeg
autoreconf -fvi
emconfigure ./configure --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 


cd /code/libpng
libtoolize
# aclocal
autoreconf
automake --add-missing
# ./autogen
emconfigure ./configure --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 


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
emconfigure ./configure --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 


# cd /code/libwebp/webp_js
# WEBP_MAKE_FLAGS=-DZLIB_INCLUDE_DIR=/coe/zlib -DZLIB_LIBRARY=/code/zlib
# cmake $WEBP_MAKE_FLAGS $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS"  -DEMSCRIPTEN_GENERATE_BITCODE_STATIC_LIBRARIES=1 -DWEBP_BUILD_WEBP_JS=ON -DCMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake ..
# emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 


cd /code/ImageMagick

autoconf

emconfigure ./configure --prefix=/ --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x --disable-largefile --disable-openmp --without-bzlib --without-dps --with-freetype --without-jbig --without-openjp2 --without-lcms --without-wmf --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp --without-xml

PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:/code/webp_js/src:/code/webp_js/src/demux"

emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 

# produce the correct output file
/bin/bash ./libtool --silent --tag=CC --mode=link emcc $MAKE_FLAGS $CXXFLAGS -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/libwebp -L/code/libwebp/webp_js -o utilities/magick.html utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la
# -L/code/libwebp -L/code/libwebp/webp_js