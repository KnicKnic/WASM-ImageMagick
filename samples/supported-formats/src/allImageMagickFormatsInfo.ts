export const allImageMagickFormatsInfo: {[format: string]: {mode: string, description: string, notes: string}} = {
  'aai': {
    mode: 'RW',
    description: 'AAI Dune image',
    notes: '',
  },
  'art': {
    mode: 'RW',
    description: 'PFS: 1st Publisher',
    notes: 'Format originally used on the Macintosh (MacPaint?) and later used for PFS: 1st Publisher clip art.',
  },
  'arw': {
    mode: 'R',
    description: 'Sony Digital Camera Alpha Raw Image Format',
    notes: '',
  },
  'avi': {
    mode: 'R',
    description: 'Microsoft Audio/Visual Interleaved',
    notes: '',
  },
  'avs': {
    mode: 'RW',
    description: 'AVS X image',
    notes: '',
  },
  'bpg': {
    mode: 'RW',
    description: 'Better Portable Graphics',
    notes: 'Use -quality to specify the image compression quality.  To meet the requirements of BPG, the quality argument divided by 2 (e.g. -quality 92 assigns 46 as the BPG compression.',
  },
  'bmp, bmp2, bmp3': {
    mode: 'RW',
    description: 'Microsoft Windows bitmap',
    notes: 'By default the BMP format is version 4.  Use BMP3 and BMP2 to write versions 3 and 2 respectively.',
  },
  'brf': {
    mode: 'W',
    description: 'Braille Ready Format',
    notes: 'Uses juxtaposition of 6-dot braille patterns (thus 6x2 dot matrices) to reproduce images, using the BRF ASCII Braille encoding.',
  },
  'cals': {
    mode: 'R',
    description: 'Continuous Acquisition and Life-cycle Support Type 1 image',
    notes: 'Specified in MIL-R-28002 and MIL-PRF-28002. Standard blueprint archive format as used by the US military to replace microfiche.',
  },
  'cgm': {
    mode: 'R',
    description: 'Computer Graphics Metafile',
    notes: 'Requires ralcgm to render CGM files.',
  },
  'cin': {
    mode: 'RW',
    description: 'Kodak Cineon Image Format',
    notes: 'Use -set to specify the image gamma or black and white points (e.g. -set gamma 1.7, -set reference-black 95, -set reference-white 685).  Properties include cin:file.create_date, cin:file.create_time, cin:file.filename, cin:file.version, cin:film.count, cin:film.format, cin:film.frame_id, cin:film.frame_position, cin:film.frame_rate, cin:film.id, cin:film.offset, cin:film.prefix, cin:film.slate_info, cin:film.type, cin:image.label, cin:origination.create_date, cin:origination.create_time, cin:origination.device, cin:origination.filename, cin:origination.model, cin:origination.serial, cin:origination.x_offset, cin:origination.x_pitch, cin:origination.y_offset, cin:origination.y_pitch, cin:user.data.',
  },
  'cip': {
    mode: 'W',
    description: 'Cisco IP phone image format',
    notes: '',
  },
  'cmyk': {
    mode: 'RW',
    description: 'Raw cyan, magenta, yellow, and black samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'cmyka': {
    mode: 'RW',
    description: 'Raw cyan, magenta, yellow, black, and alpha samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'cr2': {
    mode: 'R',
    description: 'Canon Digital Camera Raw Image Format',
    notes: 'Requires an explicit image format otherwise the image is interpreted as a TIFF image (e.g. cr2:image.cr2).',
  },
  'crw': {
    mode: 'R',
    description: 'Canon Digital Camera Raw Image Format',
    notes: '',
  },
  'cur': {
    mode: 'R',
    description: 'Microsoft Cursor Icon',
    notes: '',
  },
  'cut': {
    mode: 'R',
    description: 'DR Halo',
    notes: '',
  },
  'dcm': {
    mode: 'R',
    description: 'Digital Imaging and Communications in Medicine (DICOM) image',
    notes: 'Used by the medical community for images like X-rays.  ImageMagick sets the initial display range based on the Window Center (0028,1050) and Window Width (0028,1051) tags. Use -define dcm:display-range=reset to set the display range to the minimum and maximum pixel values. Use -define dcm:rescale=true to enable interpretation of the rescale slope and intercept settings in the file. Use -define dcm:window=centerXwidth to override the center and width settings in the file with your own values.',
  },
  'dcr': {
    mode: 'R',
    description: 'Kodak Digital Camera Raw Image File',
    notes: '',
  },
  'dcx': {
    mode: 'RW',
    description: 'ZSoft IBM PC multi-page Paintbrush image',
    notes: '',
  },
  'dds': {
    mode: 'RW',
    description: 'Microsoft Direct Draw Surface',
    notes: 'Use -define to specify the compression (e.g. -define dds:compression={dxt1, dxt5, none}). Other defines include dds:cluster-fit={true,false}, dds:weight-by-alpha={true,false}, dds:fast-mipmaps={true,false}, and use dds:mipmaps to set the number of mipmaps (use fromlist to use the image list).',
  },
  'dib': {
    mode: 'RW',
    description: 'Microsoft Windows Device Independent Bitmap',
    notes: 'DIB is a BMP file without the BMP header. Used to support embedded images in compound formats like WMF.',
  },
  'djvu': {
    mode: 'R',
    description: '',
    notes: '',
  },
  'dng': {
    mode: 'R',
    description: 'Digital Negative',
    notes: 'Requires an explicit image format otherwise the image is interpreted as a TIFF image (e.g. dng:image.dng).',
  },
  'dot': {
    mode: 'R',
    description: 'Graph Visualization',
    notes: 'Use -define to specify the layout engine (e.g. -define dot:layout-engine=twopi).',
  },
  'dpx': {
    mode: 'RW',
    description: 'SMPTE Digital Moving Picture Exchange 2.0 (SMPTE 268M-2003)',
    notes: 'Use -set to specify the image gamma or black and white points (e.g. -set gamma 1.7, -set reference-black 95, -set reference-white 685).',
  },
  'emf': {
    mode: 'R',
    description: 'Microsoft Enhanced Metafile (32-bit)',
    notes: 'Only available under Microsoft Windows.  Use -size command line option to specify the maximum width and height.',
  },
  'epdf': {
    mode: 'RW',
    description: 'Encapsulated Portable Document Format',
    notes: '',
  },
  'epi': {
    mode: 'RW',
    description: 'Adobe Encapsulated PostScript Interchange format',
    notes: 'Requires Ghostscript to read.',
  },
  'eps': {
    mode: 'RW',
    description: 'Adobe Encapsulated PostScript',
    notes: 'Requires Ghostscript to read.',
  },
  'eps2': {
    mode: 'W',
    description: 'Adobe Level II Encapsulated PostScript',
    notes: 'Requires Ghostscript to read.',
  },
  'eps3': {
    mode: 'W',
    description: 'Adobe Level III Encapsulated PostScript',
    notes: 'Requires Ghostscript to read.',
  },
  'epsf': {
    mode: 'RW',
    description: 'Adobe Encapsulated PostScript',
    notes: 'Requires Ghostscript to read.',
  },
  'epsi': {
    mode: 'RW',
    description: 'Adobe Encapsulated PostScript Interchange format',
    notes: 'Requires Ghostscript to read.',
  },
  'ept': {
    mode: 'RW',
    description: 'Adobe Encapsulated PostScript Interchange format with TIFF preview',
    notes: 'Requires Ghostscript to read.',
  },
  'exr': {
    mode: 'RW',
    description: 'High dynamic-range (HDR) file format developed by Industrial Light & Magic',
    notes: 'See High Dynamic-Range Images for details on this image format. To specify the output color type, use -define exr:color-type={RGB,RGBA,YC,YCA,Y,YA,R,G,B,A}. Use -sampling-factor to specify the sampling rate for YC(A) (e.g. 2x2 or 4:2:0). Requires the OpenEXR delegate library.',
  },
  'fax': {
    mode: 'RW',
    description: 'Group 3 TIFF',
    notes: 'This format is a fixed width of 1728 as required by the standard.  See TIFF format. Note that FAX machines use non-square pixels which are 1.5 times wider than they are tall but computer displays use square pixels so FAX images may appear to be narrow unless they are explicitly resized using a resize specification of 100x150%.',
  },
  'fig': {
    mode: 'R',
    description: 'FIG graphics format',
    notes: 'Requires TransFig.',
  },
  'fits': {
    mode: 'RW',
    description: 'Flexible Image Transport System',
    notes: 'To specify a single-precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 64 for a double-precision floating-point format.',
  },
  'fpx': {
    mode: 'RW',
    description: 'FlashPix Format',
    notes: 'FlashPix has the option to store mega- and giga-pixel images at various resolutions in a single file which permits conservative bandwidth and fast reveal times when displayed within a Web browser.  Requires the FlashPix SDK. Specify the FlashPix viewing parameters with the -define fpx:view.',
  },
  'gif': {
    mode: 'RW',
    description: 'CompuServe Graphics Interchange Format',
    notes: '8-bit RGB PseudoColor with up to 256 palette entries. Specify the format GIF87 to write the older version 87a of the format.  Use -transparent-color to specify the GIF transparent color (e.g. -transparent-color wheat).',
  },
  'gplt': {
    mode: 'R',
    description: 'Gnuplot plot files',
    notes: 'Requires gnuplot4.0.tar.Z or later.',
  },
  'gray': {
    mode: 'RW',
    description: 'Raw gray samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'graya': {
    mode: 'RW',
    description: 'Raw gray and alpha samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'hdr': {
    mode: 'RW',
    description: 'Radiance RGBE image format',
    notes: '',
  },
  'heic': {
    mode: 'R',
    description: 'Apple High efficiency Image Format',
    notes: 'HEIC requires the libheif delegate library.',
  },
  'hpgl': {
    mode: 'R',
    description: 'HP-GL plotter language',
    notes: 'Requires hp2xx-3.4.4.tar.gz',
  },
  'hrz': {
    mode: 'RW',
    description: 'Slow Scane TeleVision',
    notes: '',
  },
  'html': {
    mode: 'RW',
    description: 'Hypertext Markup Language with a client-side image map',
    notes: 'Also known as HTM. Requires html2ps to read.',
  },
  'ico': {
    mode: 'R',
    description: 'Microsoft icon',
    notes: 'Also known as ICON.',
  },
  'info': {
    mode: 'W',
    description: 'Format and characteristics of the image',
    notes: '',
  },
  'inline': {
    mode: 'RW',
    description: 'Base64-encoded inline image',
    notes: 'The inline image look similar to inline:data:;base64,/9j/4AAQSk...knrn//2Q==.  If the inline image exceeds 5000 characters, reference it from a file (e.g. inline:inline.txt). You can also write a base64-encoded image.  Embed the mime type in the filename, for example, convert myimage inline:jpeg:myimage.txt.',
  },
  'isobrl': {
    mode: 'W',
    description: 'ISO/TR 11548-1 BRaiLle',
    notes: 'Uses juxtaposition of 8-dot braille patterns (thus 8x2 dot matrices) to reproduce images, using the ISO/TR 11548-1 Braille encoding.',
  },
  'isobrl6': {
    mode: 'W',
    description: 'ISO/TR 11548-1 BRaiLle 6 dots',
    notes: 'Uses juxtaposition of 6-dot braille patterns (thus 6x2 dot matrices) to reproduce images, using the ISO/TR 11548-1 Braille encoding.',
  },
  'jbig': {
    mode: 'RW',
    description: 'Joint Bi-level Image experts Group file interchange format',
    notes: 'Also known as BIE and JBG. Requires jbigkit-1.6.tar.gz.',
  },
  'jng': {
    mode: 'RW',
    description: 'Multiple-image Network Graphics',
    notes: 'JPEG in a PNG-style wrapper with transparency. Requires libjpeg and libpng-1.0.11 or later, libpng-1.2.5 or later recommended.',
  },
  'jp2': {
    mode: 'RW',
    description: 'JPEG-2000 JP2 File Format Syntax',
    notes: 'Specify the encoding options with the -define option. See JP2 Encoding Options for more details.',
  },
  'jpt': {
    mode: 'RW',
    description: 'JPEG-2000 Code Stream Syntax',
    notes: 'Specify the encoding options with the -define option  See JP2 Encoding Options for more details.',
  },
  'j2c': {
    mode: 'RW',
    description: 'JPEG-2000 Code Stream Syntax',
    notes: 'Specify the encoding options with the -define option  See JP2 Encoding Options for more details.',
  },
  'j2k': {
    mode: 'RW',
    description: 'JPEG-2000 Code Stream Syntax',
    notes: 'Specify the encoding options with the -define option  See JP2 Encoding Options for more details.',
  },
  'jpeg': {
    mode: 'RW',
    description: 'Joint Photographic Experts Group JFIF format',
    notes: 'Note, JPEG is a lossy compression.  In addition, you cannot create black and white images with JPEG nor can you save transparency.\n\n Requires jpegsrc.v8c.tar.gz.  You can set quality scaling for luminance and chrominance separately (e.g. -quality 90,70). You can optionally define the DCT method, for example to specify the float method, use -define jpeg:dct-method=float. By default we compute optimal Huffman coding tables.  Specify -define jpeg:optimize-coding=false to use the default Huffman tables. Two other options include -define jpeg:block-smoothing and -define jpeg:fancy-upsampling. Set the sampling factor with -define jpeg:sampling-factor. You can size the image with jpeg:size, for example -define jpeg:size=128x128. To restrict the maximum file size, use jpeg:extent, for example -define jpeg:extent=400KB.  To define one or more custom quantization tables, use -define jpeg:q-table=filename. To avoid reading a particular associated image profile, use -define profile:skip=name (e.g. profile:skip=ICC).',
  },
  'jxr': {
    mode: 'RW',
    description: 'JPEG extended range',
    notes: 'Requires the jxrlib delegate library. Put the JxrDecApp and JxrEncApp applications in your execution path.',
  },
  'json': {
    mode: 'W',
    description: 'JavaScript Object Notation, a lightweight data-interchange format',
    notes: 'Include additional attributes about the image with these defines: -define json:locate, -define json:limit, -define json:moments, or -define json:features.',
  },
  'man': {
    mode: 'R',
    description: 'Unix reference manual pages',
    notes: 'Requires that GNU groff and Ghostcript are installed.',
  },
  'mat': {
    mode: 'R',
    description: 'MATLAB image format',
    notes: '',
  },
  'miff': {
    mode: 'RW',
    description: 'Magick image file format',
    notes: 'This format persists all image attributes known to ImageMagick.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'mono': {
    mode: 'RW',
    description: 'Bi-level bitmap in least-significant-byte first order',
    notes: '',
  },
  'mng': {
    mode: 'RW',
    description: 'Multiple-image Network Graphics',
    notes: 'A PNG-like Image Format Supporting Multiple Images, Animation and Transparent JPEG. Requires libpng-1.0.11 or later, libpng-1.2.5 or later recommended. An interframe delay of 0 generates one frame with each additional layer composited on top.  For motion, be sure to specify a non-zero delay.',
  },
  'm2v': {
    mode: 'RW',
    description: 'Motion Picture Experts Group file interchange format (version 2)',
    notes: 'Requires ffmpeg.',
  },
  'mpeg': {
    mode: 'RW',
    description: 'Motion Picture Experts Group file interchange format (version 1)',
    notes: 'Requires ffmpeg.',
  },
  'mpc': {
    mode: 'RW',
    description: 'Magick Persistent Cache image file format',
    notes: 'The most efficient data processing pattern is a write-once, read-many-times pattern. The image is generated or copied from source, then various analyses are performed on the image pixels over time.  MPC supports this pattern. MPC is the native in-memory ImageMagick uncompressed file format. This file format is identical to that used by ImageMagick to represent images in memory and is read by mapping the file directly into memory. The MPC format is not portable and is not suitable as an archive format. It is suitable as an intermediate format for high-performance image processing.  The MPC format requires two files to support one image. Image attributes are written to a file with the extension .mpc, whereas, image pixels are written to a file with the extension .cache.',
  },
  'mpr': {
    mode: 'RW',
    description: 'Magick Persistent Registry',
    notes: 'This format permits you to write to and read images from memory.  The image persists until the program exits.  For example, let\'s use the MPR to create a checkerboard: convert \\( -size 15x15 canvas:black canvas:white -append \\) \\   \\( +clone -flip \\) +append -write mpr:checkers +delete \\   -size 240x240 tile:mpr:checkers board.png',
  },
  'mrw': {
    mode: 'R',
    description: 'Sony (Minolta) Raw Image File',
    notes: '',
  },
  'msl': {
    mode: 'RW',
    description: 'Magick Scripting Language',
    notes: 'MSL is the XML-based scripting language supported by the conjure utility. MSL requires the libxml2 delegate library.',
  },
  'mtv': {
    mode: 'RW',
    description: 'MTV Raytracing image format',
    notes: '',
  },
  'mvg': {
    mode: 'RW',
    description: 'Magick Vector Graphics.',
    notes: 'The native ImageMagick vector metafile format. A text file containing vector drawing commands accepted by convert\'s -draw option.',
  },
  'nef': {
    mode: 'R',
    description: 'Nikon Digital SLR Camera Raw Image File',
    notes: '',
  },
  'orf': {
    mode: 'R',
    description: 'Olympus Digital Camera Raw Image File',
    notes: '',
  },
  'otb': {
    mode: 'RW',
    description: 'On-the-air Bitmap',
    notes: '',
  },
  'p7': {
    mode: 'RW',
    description: 'Xv\'s Visual Schnauzer thumbnail format',
    notes: '',
  },
  'palm': {
    mode: 'RW',
    description: 'Palm pixmap',
    notes: '',
  },
  'pam': {
    mode: 'W',
    description: 'Common 2-dimensional bitmap format',
    notes: '',
  },
  'clipboard': {
    mode: 'RW',
    description: 'Windows Clipboard',
    notes: 'Only available under Microsoft Windows.',
  },
  'pbm': {
    mode: 'RW',
    description: 'Portable bitmap format (black and white)',
    notes: '',
  },
  'pcd': {
    mode: 'RW',
    description: 'Photo CD',
    notes: 'The maximum resolution written is 768x512 pixels since larger images require huffman compression (which is not supported). Use -bordercolor to specify the border color (e.g. -bordercolor black).',
  },
  'pcds': {
    mode: 'RW',
    description: 'Photo CD',
    notes: 'Decode with the sRGB color tables.',
  },
  'pcl': {
    mode: 'W',
    description: 'HP Page Control Language',
    notes: 'Use -define to specify fit to page option (e.g. -define pcl:fit-to-page=true).',
  },
  'pcx': {
    mode: 'RW',
    description: 'ZSoft IBM PC Paintbrush file',
    notes: '',
  },
  'pdb': {
    mode: 'RW',
    description: 'Palm Database ImageViewer Format',
    notes: '',
  },
  'pdf': {
    mode: 'RW',
    description: 'Portable Document Format',
    notes: 'Requires Ghostscript to read.  By default, ImageMagick sets the page size to the MediaBox. Some PDF files, however, have a CropBox or TrimBox that is smaller than the MediaBox and may include white space, registration or cutting marks outside the CropBox or TrimBox. To force ImageMagick to use the CropBox or TrimBox rather than the MediaBox, use -define (e.g. -define pdf:use-cropbox=true or -define pdf:use-trimbox=true).  Use -density to improve the appearance of your PDF rendering (e.g. -density 300x300).  Use -alpha remove  to remove transparency. To specify direct conversion from  Postscript to PDF, use -define delegate:bimodel=true. Use -define pdf:fit-page=true to scale to the page size. To immediately stop processing upon an error, set -define pdf:stop-on-error to true. To set the page direction preferences to right-to-left, try  -define pdf:page-direction=right-to-left.',
  },
  'pef': {
    mode: 'R',
    description: 'Pentax Electronic File',
    notes: 'Requires an explicit image format otherwise the image is interpreted as a TIFF image (e.g. pef:image.pef).',
  },
  'pes': {
    mode: 'R',
    description: 'Embrid Embroidery Format',
    notes: '',
  },
  'pfa': {
    mode: 'R',
    description: 'Postscript Type 1 font (ASCII)',
    notes: 'Opening as file returns a preview image.',
  },
  'pfb': {
    mode: 'R',
    description: 'Postscript Type 1 font (binary)',
    notes: 'Opening as file returns a preview image.',
  },
  'pfm': {
    mode: 'RW',
    description: 'Portable float map format',
    notes: '',
  },
  'pgm': {
    mode: 'RW',
    description: 'Portable graymap format (gray scale)',
    notes: '',
  },
  'picon': {
    mode: 'RW',
    description: 'Personal Icon',
    notes: '',
  },
  'pict': {
    mode: 'RW',
    description: 'Apple Macintosh QuickDraw/PICT file',
    notes: '',
  },
  'pix': {
    mode: 'R',
    description: 'Alias/Wavefront RLE image format',
    notes: '',
  },
  'png': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: 'Requires libpng-1.0.11 or later, libpng-1.2.5 or later recommended. The PNG specification does not support pixels-per-inch units, only pixels-per-centimeter. To avoid reading a particular associated image profile, use -define profile:skip=name (e.g. profile:skip=ICC).',
  },
  'png8': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: '8-bit indexed with optional binary transparency',
  },
  'png00': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: 'PNG inheriting subformat from original if possible',
  },
  'png24': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: 'opaque or binary transparent 24-bit RGB',
  },
  'png32': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: 'opaque or transparent 32-bit RGBA',
  },
  'png48': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: 'opaque or binary transparent 48-bit RGB',
  },
  'png64': {
    mode: 'RW',
    description: 'Portable Network Graphics',
    notes: 'opaque or transparent 64-bit RGB',
  },
  'pnm': {
    mode: 'RW',
    description: 'Portable anymap',
    notes: 'PNM is a family of formats supporting portable bitmaps (PBM) , graymaps (PGM), and pixmaps (PPM). There is no file format associated with pnm itself. If PNM is used as the output format specifier, then ImageMagick automagically selects the most appropriate format to represent the image.  The default is to write the binary version of the formats. Use -compress none to write the ASCII version of the formats.',
  },
  'ppm': {
    mode: 'RW',
    description: 'Portable pixmap format (color)',
    notes: '',
  },
  'ps': {
    mode: 'RW',
    description: 'Adobe PostScript file',
    notes: 'Requires Ghostscript to read. To force ImageMagick to respect the crop box, use -define (e.g. -define eps:use-cropbox=true). Use -density to improve the appearance of your Postscript rendering (e.g. -density 300x300). Use -alpha remove  to remove transparency. To specify direct conversion from PDF to Postscript, use -define delegate:bimodel=true.',
  },
  'ps2': {
    mode: 'RW',
    description: 'Adobe Level II PostScript file',
    notes: 'Requires Ghostscript to read.',
  },
  'ps3': {
    mode: 'RW',
    description: 'Adobe Level III PostScript file',
    notes: 'Requires Ghostscript to read.',
  },
  'psb': {
    mode: 'RW',
    description: 'Adobe Large Document Format',
    notes: '',
  },
  'psd': {
    mode: 'RW',
    description: 'Adobe Photoshop bitmap file',
    notes: 'Use -define psd:alpha-unblend=off to disable alpha blenning in the merged image. Use -define psd:additional-info=all|selective to transfer additional information from the input PSD file to output PSD file. The \'selective\' option will preserve all additional information that is not related to the geometry of the image. The \'all\' option should only be used when the geometry of the image has not been changed. This option is helpful when transferring non-simple layers, such as adjustment layers from the input PSD file to the output PSD file. This define is available as of Imagemagick version 6.9.5-8. Use -define psd:preserve-opacity-mask=true to preserve the opacity mask of a layer and add it back to the layer when the image is saved.',
  },
  'ptif': {
    mode: 'RW',
    description: 'Pyramid encoded TIFF',
    notes: 'Multi-resolution TIFF containing successively smaller versions of the image down to the size of an icon.',
  },
  'pwp': {
    mode: 'R',
    description: 'Seattle File Works multi-image file',
    notes: '',
  },
  'rad': {
    mode: 'R',
    description: 'Radiance image file',
    notes: 'Requires that ra_ppm from the Radiance software package be installed.',
  },
  'raf': {
    mode: 'R',
    description: 'Fuji CCD-RAW Graphic File',
    notes: '',
  },
  'rgb': {
    mode: 'RW',
    description: 'Raw red, green, and blue samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'rgba': {
    mode: 'RW',
    description: 'Raw red, green, blue, and alpha samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.  To specify a single precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 32 for single precision floats, 64 for double precision, and 16 for half-precision.',
  },
  'rgf': {
    mode: 'RW',
    description: 'LEGO Mindstorms EV3 Robot Graphics File',
    notes: '',
  },
  'rla': {
    mode: 'R',
    description: 'Alias/Wavefront image file',
    notes: '',
  },
  'rle': {
    mode: 'R',
    description: 'Utah Run length encoded image file',
    notes: '',
  },
  'sct': {
    mode: 'R',
    description: 'Scitex Continuous Tone Picture',
    notes: '',
  },
  'sfw': {
    mode: 'R',
    description: 'Seattle File Works image',
    notes: '',
  },
  'sgi': {
    mode: 'RW',
    description: 'Irix RGB image',
    notes: '',
  },
  'shtml': {
    mode: 'W',
    description: 'Hypertext Markup Language client-side image map',
    notes: 'Used to write HTML clickable image maps based on a the output of montage or a format which supports tiled images such as MIFF.',
  },
  'sid, mrsid': {
    mode: 'R',
    description: 'Multiresolution seamless image',
    notes: 'Requires the mrsidgeodecode command line utility that decompresses MG2 or MG3 SID image files.',
  },
  'sparse-color': {
    mode: 'W',
    description: 'Raw text file',
    notes: 'Format compatible with the -sparse-color option. Lists only non-fully-transparent pixels.',
  },
  'sun': {
    mode: 'RW',
    description: 'SUN Rasterfile',
    notes: '',
  },
  'svg': {
    mode: 'RW',
    description: 'Scalable Vector Graphics',
    notes: 'ImageMagick utilizes inkscape if its in your execution path otherwise RSVG. If neither are available, ImageMagick reverts to its internal SVG renderer. The default resolution is 96 DPI. Use -size command line option to specify the maximum width and height.',
  },
  'text': {
    mode: 'R',
    description: 'text file',
    notes: 'Requires an explicit format specifier to read, e.g. text:README.txt.',
  },
  'tga': {
    mode: 'RW',
    description: 'Truevision Targa image',
    notes: 'Also known as formats ICB, VDA, and VST.',
  },
  'tiff': {
    mode: 'RW',
    description: 'Tagged Image File Format',
    notes: 'Also known as TIF. Requires tiff-v3.6.1.tar.gz or later.  Use -define to specify the rows per strip (e.g. -define tiff:rows-per-strip=8).  To define the tile geometry, use for example, -define tiff:tile-geometry=128x128. To specify a signed format, use  -define quantum:format=signed. To specify a single-precision floating-point format, use -define quantum:format=floating-point.  Set the depth to 64 for a double-precision floating-point format.  Use -define quantum:polarity=min-is-black or -define quantum:polarity=min-is-white toggle the photometric interpretation for a bilevel image.  Specify the extra samples as associated or unassociated alpha with, for example, -define tiff:alpha=unassociated.  Set the fill order with -define tiff:fill-order=msb|lsb. Set the TIFF endianess with -define tiff:endian=msb|lsb. Use -define tiff:exif-properties=false to skip reading the EXIF properties.  You can set a number of TIFF software attributes including document name, host computer, artist, timestamp, make, model, software, and copyright.  For example, -set tiff:software "My Company". If you want to ignore certain TIFF tags, use this option: -define tiff:ignore-tags=comma-separated-list-of-tag-IDs. Since version 6.9.1-4 there is support for reading photoshop layers in TIFF files, this can be disabled with -define tiff:ignore-layers=true',
  },
  'tim': {
    mode: 'R',
    description: 'PSX TIM file',
    notes: '',
  },
  'ttf': {
    mode: 'R',
    description: 'TrueType font file',
    notes: 'Requires freetype 2. Opening as file returns a preview image. Use -set if you do not want to hint glyph outlines after their scaling to device pixels (e.g. -set type:hinting off).',
  },
  'txt': {
    mode: 'RW',
    description: 'Raw text file',
    notes: 'Use -define to specify the color compliance (e.g. -define txt:compliance=css).',
  },
  'ubrl': {
    mode: 'W',
    description: 'Unicode BRaiLle',
    notes: 'Uses juxtaposition of 8-dot braille patterns (thus 8x2 dot matrices) to reproduce images, using the Unicode Braille encoding.',
  },
  'ubrl6': {
    mode: 'W',
    description: 'Unicode BRaiLle 6 dots',
    notes: 'Uses juxtaposition of 6-dot braille patterns (thus 6x2 dot matrices) to reproduce images, using the Unicode Braille encoding.',
  },
  'uil': {
    mode: 'W',
    description: 'X-Motif UIL table',
    notes: '',
  },
  'uyvy': {
    mode: 'RW',
    description: 'Interleaved YUV raw image',
    notes: 'Use -size and -depth command line options to specify width and height.  Use -sampling-factor to set the desired subsampling (e.g. -sampling-factor 4:2:2).',
  },
  'vicar': {
    mode: 'RW',
    description: 'VICAR rasterfile format',
    notes: '',
  },
  'viff': {
    mode: 'RW',
    description: 'Khoros Visualization Image File Format',
    notes: '',
  },
  'wbmp': {
    mode: 'RW',
    description: 'Wireless bitmap',
    notes: 'Support for uncompressed monochrome only.',
  },
  'wdp': {
    mode: 'RW',
    description: 'JPEG extended range',
    notes: 'Requires the jxrlib delegate library. Put the JxrDecApp and JxrEncApp applications in your execution path.',
  },
  'webp': {
    mode: 'RW',
    description: 'Weppy image format',
    notes: 'Requires the WEBP delegate library.  Specify the encoding options with the -define option  See WebP Encoding Options for more details.',
  },
  'wmf': {
    mode: 'R',
    description: 'Windows Metafile',
    notes: 'Requires libwmf. By default, renders WMF files using the dimensions specified by the metafile header. Use the -density option to adjust the output resolution, and thereby adjust the output size. The default output resolution is 72DPI so -density 144 results in an image twice as large as the default. Use -background color to specify the WMF background color (default white) or -texture filename to specify a background texture image.',
  },
  'wpg': {
    mode: 'R',
    description: 'Word Perfect Graphics File',
    notes: '',
  },
  'x': {
    mode: 'RW',
    description: 'display or import an image to or from an X11 server',
    notes: 'Use -define to obtain the image from the root window (e.g. -define x:screen=true).  Set x:silent=true to turn off the beep when importing an image.',
  },
  'xbm': {
    mode: 'RW',
    description: 'X Windows system bitmap, black and white only',
    notes: 'Used by the X Windows System to store monochrome icons.',
  },
  'xcf': {
    mode: 'R',
    description: 'GIMP image',
    notes: '',
  },
  'xpm': {
    mode: 'RW',
    description: 'X Windows system pixmap',
    notes: 'Also known as PM. Used by the X Windows System to store color icons.',
  },
  'xwd': {
    mode: 'RW',
    description: 'X Windows system window dump',
    notes: 'Used by the X Windows System to save/display screen dumps.',
  },
  'x3f': {
    mode: 'R',
    description: 'Sigma Camera RAW Picture File',
    notes: '',
  },
  'ycbcr': {
    mode: 'RW',
    description: 'Raw Y, Cb, and Cr samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.',
  },
  'ycbcra': {
    mode: 'RW',
    description: 'Raw Y, Cb, Cr, and alpha samples',
    notes: 'Use -size and -depth to specify the image width, height, and depth.',
  },
  'yuv': {
    mode: 'RW',
    description: 'CCIR 601 4:1:1',
    notes: 'Use -size and -depth command line options to specify width, height, and depth.   Use -sampling-factor to set the desired subsampling (e.g. -sampling-factor 4:2:2).',
  },
}
