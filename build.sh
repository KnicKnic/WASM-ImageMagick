export CPPFLAGS="-I/code/prefix/include -I$HOME/.emscripten_ports/freetype/FreeType-version_1/include"
export LDFLAGS="-L/code/prefix/lib"
export MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1"
export CFLAGS="-O3 $CPPFLAGS $MAKE_FLAGS"
export CXXFLAGS="$CFLAGS"
export EM_BUILD_VERBOSE="0"
export PKG_CONFIG_PATH="/code/prefix/lib/pkgconfig"
export PNG_LIBS="$LDFLAGS"

testExitCode  ()
{
  name=$1
  exitCode=$2
  echo "

  $name exit code: $exitCode

  "
  if [ "$exitCode" -ne "0" ]; then
    exit 1
  fi
}

rm -rf /code/ImageMagick/utilities/magick.{wasm,js} 
# rm -rf /code/prefix

# cd /code/zlib
# emconfigure ./configure --prefix=/code/prefix --static 
# testExitCode "zlib configure" $?
# emcmake make CFLAGS="$CFLAGS"
# testExitCode "zlib make" $?
# emcmake make install

# cd /code/libjpeg
# autoreconf -fvi
# emconfigure ./configure --prefix=/code/prefix --disable-shared
# testExitCode "libjpeg configure" $?
# emcmake make CFAGS="$CFLAGS $LDFLAGS"
# testExitCode "libjpeg make" $?
# emcmake make install

# cd /code/libpng
# libtoolize
# # aclocal
# autoreconf
# automake --add-missing
# # ./autogen
# emconfigure ./configure --prefix=/code/prefix --disable-shared
# testExitCode "libpng configure" $?
# emcmake make 
# testExitCode "libpng make" $?
# emcmake make install


# cd /code/libtiff
# libtoolize --force
# ###
# aclocal
# ###
# autoreconf --force
# #### 
# automake --add-missing
# ./autogen
# autoconf
# autoreconf
# ####
# emconfigure ./configure --prefix=/code/prefix --disable-shared
# testExitCode "libtiff configure" $?
# emcmake make $MAKE_FLAGS CFLAGS="$CFLAGS" CXXFLAGS="$CXXFLAGS"
# testExitCode "libtiff make" $?
# emcmake make install


cd /code/ImageMagick

# make sure freetype port folder exists since we are reading .h files from there: 
emcc -s USE_FREETYPE=1 --cflags



emconfigure ./configure --prefix=/code/prefix --disable-shared --disable-docs --without-threads --without-magick-plus-plus --without-perl --without-x \
  --disable-largefile --disable-openmp --without-bzlib --without-dps --without-jbig --without-openjp2 --without-lcms --without-wmf \
  --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib \
  --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp \
  --without-xml PKG_CONFIG_PATH="$PKG_CONFIG_PATH"
testExitCode "ImageMagick configure" $?

# include emscripten freetype port and its includes files. 
# heads up - there are some unresolved symbols on link so we need to use emscripten setting -s ERROR_ON_UNDEFINED_SYMBOLS=0 
export CFLAGS="$CFLAGS -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s USE_FREETYPE=1"
emcmake make CFLAGS="$CFLAGS"
testExitCode "ImageMagick make" $?

emcmake make install
testExitCode "ImageMagick make install" $?

# produce the correct output file
./libtool --silent --tag=CC --mode=link emcc $LDFLAGS $CFLAGS -o utilities/magick.html utilities/magick.o /code/prefix/lib/libMagickCore-7.Q16HDRI.la  /code/prefix/lib/libMagickWand-7.Q16HDRI.la
testExitCode "ImageMagick link" $?