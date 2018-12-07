export CPPFLAGS="-I/code/libpng -I/code/zlib -I/code/libjpeg -I/code/libtiff/libtiff `pkg-config --cflags freetype2`"
# export CPPFLAGS="-I/code/libpng -I/code/zlib -I/code/libjpeg -I/code/libtiff/libtiff `pkg-config --cflags freetype2` -I/code/libwebp/src"

export PNG_LIBS="-L/code/libpng -L/code/libpng/.libs"
export LDFLAGS="-L/code/zlib $PNG_LIBS -L/code/libjpeg -L/code/libtiff/libtiff"

export CFLAGS="-O3"

export CXXFLAGS="$CFLAGS"

export MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s USE_FREETYPE=1"
# export MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s USE_FREETYPE=1 -s ERROR_ON_UNDEFINED_SYMBOLS=0"


export PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
# PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:/code/libwebp/webp_js/src:/code/libwebp/webp_js/src/demux:"

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
# make clean
# rm -rf src/webp/config.h webp*.wasm WebPConfig* CMakeFiles

# ## WEBP_MAKE_FLAGS="-DZLIB_INCLUDE_DIR=/coe/zlib -DZLIB_LIBRARY=/code/zlib -DPNG_LIBRARY=/code/libpng -DPNG_PNG_INCLUDE_DIR=/code/libpng -DJPEG_LIBRARY=/code/libjpeg -DJPEG_INCLUDE_DIR=/code/libjpeg -DTIFF_LIBRARY=/code/libtiff/libtiff -DTIFF_INCLUDE_DIR=/code/libtiff/libtiff -DEMSCRIPTEN_GENERATE_BITCODE_STATIC_LIBRARIES=1 -DCMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake -DWEBP_BUILD_WEBP_JS=ON"
# ## emconfigure cmake --disable-shared --static $WEBP_MAKE_FLAGS $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS " ..   #

# cmake -DWEBP_BUILD_WEBP_JS=ON -DEMSCRIPTEN_GENERATE_BITCODE_STATIC_LIBRARIES=1  -DCMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake  ..
# make

cd /code/ImageMagick

autoconf

emconfigure ./configure --prefix=/ --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x --disable-largefile --disable-openmp --without-bzlib --without-dps --with-freetype --without-jbig --without-openjp2 --without-lcms --without-wmf --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp --without-xml

PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
# PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:/code/webp_js/src:/code/webp_js/src/demux"

emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 

# link
/bin/bash ./libtool --tag=CC --mode=link emcc $MAKE_FLAGS $CXXFLAGS -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg  -o utilities/magick.html utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la 


# /bin/bash ./libtool --silent --tag=CC --mode=link emcc $MAKE_FLAGS $CXXFLAGS -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg /code/libwebp/webp_js/libwebpdemux.bc  /code/libwebp/webp_js/libwebp.bc utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la  -o utilities/magick.html
