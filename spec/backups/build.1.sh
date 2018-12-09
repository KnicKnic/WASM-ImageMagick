export CPPFLAGS="-I/code/prefix/include -I$HOME/.emscripten_ports/freetype/FreeType-version_1/include"
export LDFLAGS="-L/code/prefix/lib"
export MAKE_FLAGS="-s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1"
export CFLAGS="-O3 $CPPFLAGS $MAKE_FLAGS"
export CXXFLAGS="$CFLAGS"
# export EM_BUILD_VERBOSE="1"
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
rm -rf /code/prefix
# make sure ports folder are available
emcc -s FREE_TYPE=1 --cflags


# # make sure zlib port folder is available
# emcc -s USE_ZLIB=1 --cflags
# # we configure and install it natively just to cheat other packages configuration
# cd $HOME/.emscripten_ports/zlib/zlib-version_1
# export EMMAKEN_JUST_CONFIGURE=1
# chmod a+x ./configure 
# emconfigure ./configure --prefix=/code/prefix --static 
# emcmake make
# emcmake make install
# unset EMMAKEN_JUST_CONFIGURE

cd /code/zlib
emconfigure ./configure --prefix=/code/prefix --static 
testExitCode "zlib configure" $?
emcmake make CFLAGS="$CFLAGS"
testExitCode "zlib make" $?
emcmake make install


# # make sure libpng port folder is available
# emcc -s USE_LIBPNG=1 --cflags
# # we configure and install it natively just to cheat other packages configuration
# cd $HOME/.emscripten_ports/libpng/libpng-version_1
# export EMMAKEN_JUST_CONFIGURE=1
# libtoolize
# autoreconf
# automake --add-missing
# emconfigure ./configure --prefix=/code/prefix
# emcmake make CFLAGS="$CFLAGS"
# emcmake make install 
# unset EMMAKEN_JUST_CONFIGURE


cd /code/libpng
# libtoolize
# # aclocal
# autoreconf
# automake --add-missing
# # ./autogen
emconfigure ./configure --prefix=/code/prefix --disable-shared
testExitCode "libpng configure" $?
emcmake make CFLAGS="$CFLAGS"
testExitCode "libpng make" $?
emcmake make install


cd /code/libjpeg
autoreconf -fvi
emconfigure ./configure --prefix=/code/prefix --disable-share
testExitCode "libjpeg configure" $?
emcmake make CFLAGS="$CFLAGS"
testExitCode "libjpeg make" $?
emcmake make install



cd /code/libtiff
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
####
emconfigure ./configure --prefix=/code/prefix --disable-shared
testExitCode "libtiff configure" $?
emcmake make CFLAGS="$CFLAGS"
testExitCode "libtiff make" $?
emcmake make install


cd /code/ImageMagick
# # # autoconf
emconfigure ./configure --prefix=/code/prefix --disable-shared --disable-docs --without-threads --without-magick-plus-plus --without-perl --without-x \
  --disable-largefile --disable-openmp --without-bzlib --without-dps --without-jbig --without-openjp2 --without-lcms --without-wmf \
  --without-xml --without-fftw --without-flif --without-fpx --without-djvu --without-fontconfig --without-raqm --without-gslib \
  --without-gvc --without-heic --without-lqr --without-openexr --without-pango --without-raw --without-rsvg --without-webp \
  --without-xml PKG_CONFIG_PATH="$PKG_CONFIG_PATH"
testExitCode "ImageMagick configure" $?

# rm /code/prefix/lib/libpng* /code/prefix/lib/libz*
# heads up - there are some unresolved symbols on link so we need to use emscripten setting -s ERROR_ON_UNDEFINED_SYMBOLS=0 robably because IM expects a newer freetype version than emscc ports
emcmake make CFLAGS="$CFLAGS -s USE_FREETYPE=1 -s ERROR_ON_UNDEFINED_SYMBOLS=0"
testExitCode "ImageMagick make" $?

emcmake make install
testExitCode "ImageMagick make install" $?

# produce the correct output file
./libtool --silent --tag=CC --mode=link emcc $LDFLAGS $CFLAGS -o utilities/magick.html utilities/magick.o /code/prefix/lib/libMagickCore-7.Q16HDRI.la  /code/prefix/lib/libMagickWand-7.Q16HDRI.la
testExitCode "ImageMagick link" $?

exit 0