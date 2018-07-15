function clean(){
	git clean -fd
	git reset --hard HEAD
}
cd ImageMagick
clean
cd ..\libjpeg
clean
cd ..\libpng
clean
cd ..\libtiff
clean
cd ..\zlib
clean
