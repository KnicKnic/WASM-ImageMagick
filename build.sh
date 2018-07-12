
export CPPFLAGS="-I/code/libpng -I/code/zlib -I/code/libjpeg -I/code/libtiff/libtiff"
export LDFLAGS="-L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/libtiff/libtiff"
export CFLAGS="-O3"
export CXXFLAGS="-O3"
export PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
export PNG_LIBS="-L/code/libpng -L/code/libpng/.libs"

cd /code/zlib
emcmake make -s ALLOW_MEMORY_GROWTH=1    clean
emconfigure ./configure --static
emcmake make -s ALLOW_MEMORY_GROWTH=1    CFLAGS="-O3" CXXFLAGS="-O3" 

cd /code/libjpeg
emcmake make -s ALLOW_MEMORY_GROWTH=1    clean
emconfigure ./configure --disable-shared
emcmake make -s ALLOW_MEMORY_GROWTH=1    clean
emcmake make -s ALLOW_MEMORY_GROWTH=1      CFLAGS="-O3" CXXFLAGS="-O3" 

cd /code/libpng
emcmake make -s ALLOW_MEMORY_GROWTH=1    clean
libtoolize
aclocal
autoreconf
automake --add-missing
./autogen
emconfigure ./configure --disable-shared
emcmake make -s ALLOW_MEMORY_GROWTH=1     CFLAGS="-O3" CXXFLAGS="-O3" 
emconfigure ./configure --disable-shared
emcmake make -s ALLOW_MEMORY_GROWTH=1     CFLAGS="-O3" CXXFLAGS="-O3" 

cd /code/libtiff
emcmake make -s ALLOW_MEMORY_GROWTH=1    clean
libtoolize --force
aclocal
autoreconf --force
automake --add-missing
./autogen
autoconf
autoreconf
emconfigure ./configure --disable-shared
emcmake make -s ALLOW_MEMORY_GROWTH=1      CFLAGS="-O3" CXXFLAGS="-O3" 


cd /code/ImageMagick
emcmake make -s ALLOW_MEMORY_GROWTH=1    clean
#emconfigure ./configure --prefix=/ --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x --disable-largefile --disable-openmp --without-bzlib --without-dps --without-freetype --without-jbig --without-openjp2 --without-lcms --without-wmf --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp --without-xml PKG_CONFIG_PATH="/code/libpng:/code/libpng/.libs:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
emconfigure ./configure --prefix=/ --disable-shared --without-threads --without-magick-plus-plus --without-perl --without-x --disable-largefile --disable-openmp --without-bzlib --without-dps --without-freetype --without-jbig --without-openjp2 --without-lcms --without-wmf --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp --without-xml PKG_CONFIG_PATH="/code/libpng:/code/zlib:/code/libjpeg:/code/libtiff:/code/libtiff/libtiff:"
emcmake make -s ALLOW_MEMORY_GROWTH=1    CFLAGS="-O3" CXXFLAGS="-O3" 

#produce the correct output file
/bin/bash ./libtool --silent --tag=CC   --mode=link emcc --pre-js /code/webworker.js -s ALLOW_MEMORY_GROWTH=1    -O3 -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -L/code/zlib -L/code/libpng -L/code/libpng/.libs -L/code/libjpeg -o utilities/magick.html utilities/magick.o MagickCore/libMagickCore-7.Q16HDRI.la MagickWand/libMagickWand-7.Q16HDRI.la 
