
export CPPFLAGS="-I/code/libpng -I/code/zlib -I/code/libjpeg -I/code/lcms -I/code/lcms/include -I/code/libtiff/libtiff"
export LDFLAGS="-L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/lcms -L/code/libjpeg -L/code/libtiff/libtiff"
export CFLAGS="-O3 $CPPFLAGS $LDFLAGS"
export CXXFLAGS="$CFLAGS"
MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1"

# export CFLAGS="-O0 -g2"
# export CXXFLAGS="$CFLAGS"
# MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s SAFE_HEAP=1 -s ASSERTIONS=1"

export PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:/code/lcms:"

cd /code/zlib
emconfigure ./configure --static
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 

cd /code/libjpeg
autoreconf -fvi
emconfigure ./configure --disable-shared
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 

cd /code/lcms
autoreconf -fiv
emconfigure ./configure --disable-shared --prefix=/usr/local CFLAGS="$FLAGS"
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


cd /code/ImageMagick
autoconf
#emconfigure ./configure --prefix=/ --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x --disable-largefile --disable-openmp --without-bzlib --without-dps --without-freetype --without-jbig --without-openjp2 --without-lcms --without-wmf --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp --without-xml PKG_CONFIG_PATH="/code/libpng:/code/libpng/.libs:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
emconfigure ./configure --prefix=/ --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x --disable-largefile --disable-openmp --without-bzlib --without-dps --without-freetype --without-jbig --without-openjp2 --without-wmf --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp --without-xml PKG_CONFIG_PATH="$PKG_CONFIG_PATH"
emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS" 

#produce the correct output file
#/bin/bash ./libtool --silent --tag=CC --mode=link emcc --pre-js /code/webworker.js $MAKE_FLAGS $CXXFLAGS -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -o utilities/magick.html utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la 
/bin/bash ./libtool --silent --tag=CC --mode=link emcc $MAKE_FLAGS $CXXFLAGS -o utilities/magick.html utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la
