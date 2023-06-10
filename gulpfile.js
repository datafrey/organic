import fs from 'fs';
import path from 'path';
import os from 'os';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import GulpCleanCss from 'gulp-clean-css';
import webpackStream from 'webpack-stream';
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminZopfli from 'imagemin-zopfli';
import imageminSvgo from 'imagemin-svgo';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGiflossy from 'imagemin-giflossy';

import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import fonter from 'gulp-fonter';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';

import newer from 'gulp-newer';
import webp from 'gulp-webp';

import fileInclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import replace from 'gulp-replace';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import webpcss from 'gulp-webpcss';

const distPath = path.resolve('./dist');
const srcPath = path.resolve('./src');

const distHtmlPath = distPath;
const srcHtmlPath = srcPath;

const cssDir = 'css';
// const cssPreprocessorType = 'sass'
const cssPreprocessorType = 'scss';
const distStylesPath = path.join(distPath, cssDir);
const srcStylesPath = path.join(srcPath, cssPreprocessorType);

const jsDir = 'js';
const distScriptsPath = path.join(distPath, jsDir);
const srcScriptsPath = path.join(srcPath, jsDir);
const scriptsToBundle = {
  indexApp: path.join(srcScriptsPath, 'index.js'),
  aboutApp: path.join(srcScriptsPath, 'about.js'),
  shopApp: path.join(srcScriptsPath, 'shop.js'),
  shopSingleApp: path.join(srcScriptsPath, 'shop-single.js'),
  serviceApp: path.join(srcScriptsPath, 'service.js'),
  serviceSingleApp: path.join(srcScriptsPath, 'service-single.js'),
  portfolioApp: path.join(srcScriptsPath, 'portfolio.js'),
  portfolioSingleApp: path.join(srcScriptsPath, 'portfolio-single.js'),
  teamApp: path.join(srcScriptsPath, 'team.js'),
  blogApp: path.join(srcScriptsPath, 'blog.js'),
  blogSingleApp: path.join(srcScriptsPath, 'blog-single.js'),
  contactApp: path.join(srcScriptsPath, 'contact.js'),
  '404App': path.join(srcScriptsPath, '404.js')
};

const fontsDir = 'fonts';
const distFontsPath = path.join(distPath, fontsDir);
const srcFontsPath = path.join(srcPath, fontsDir);
const fontsFile = `${srcStylesPath}/base/_fonts.scss`;

const iconsDir = 'icons';
const distIconsPath = path.join(distPath, iconsDir);
const srcIconsPath = path.join(srcPath, iconsDir);

const imgDir = 'img';
const distImagesPath = path.join(distPath, imgDir);
const srcImagesPath = path.join(srcPath, imgDir);

const bsPort = 3000;

gulp.task('html', processHtml);
gulp.task('styles', processStyles);
gulp.task('scripts', processScriptsDev);
gulp.task('otfToTtf', processFontsOtfToTtf);
gulp.task('ttfToWoff', processFontsTtfToWoff);
gulp.task('fontsStyle', processFontsStyle);
gulp.task('fonts', gulp.series('otfToTtf', 'ttfToWoff', 'fontsStyle'));
gulp.task('icons', () => processPictures(srcIconsPath, distIconsPath, 'ICONS'));
gulp.task('images', () =>
  processPictures(srcImagesPath, distImagesPath, 'IMAGES')
);
gulp.task(
  'dist-sync',
  gulp.parallel('html', 'styles', 'scripts', 'fonts', 'icons', 'images')
);
gulp.task('watch', watch);
gulp.task('build-prod-scripts', processScriptsProd);
gulp.task('default', gulp.parallel('watch'));

function fixPathForGulpWatch(oldPath) {
  const pathString = oldPath;
  const fix = /\\{1,}|\/{1,}/;
  const userHome = os.homedir();

  return pathString
    .replace(new RegExp(fix, 'gm'), '/')
    .replace(new RegExp(fix, 'gm'), '/')
    .replace('~', userHome);
}

function processHtml() {
  return gulp
    .src(`${srcHtmlPath}/*.html`)
    .pipe(
      plumber(
        notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>'
        })
      )
    )
    .pipe(fileInclude())
    .pipe(replace(/@img\//g, 'img/'))
    .pipe(replace(/@icons\//g, 'icons/'))
    .pipe(webpHtmlNosvg())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(distHtmlPath))
    .pipe(browserSync.stream());
}

function processStyles() {
  return gulp
    .src(`${srcStylesPath}/**/*.+(scss|sass)`)
    .pipe(
      plumber(
        notify.onError({
          title: 'SCSS',
          message: 'Error: <%= error.message %>'
        })
      )
    )
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(groupCssMediaQueries())
    .pipe(
      webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp'
      })
    )
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ['last 3 versions'],
        cascade: true
      })
    )
    .pipe(GulpCleanCss())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(replace(/@img\//g, '../img/'))
    .pipe(replace(/@icons\//g, '../icons/'))
    .pipe(gulp.dest(distStylesPath))
    .pipe(browserSync.stream());
}

function processScriptsDev() {
  return gulp
    .src(`${srcScriptsPath}/**/*.js`)
    .pipe(
      webpackStream({
        mode: 'development',
        entry: scriptsToBundle,
        output: {
          filename: '[name].js',
          path: distScriptsPath
        },
        watch: false,
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        debug: true,
                        corejs: 3,
                        useBuiltIns: 'usage'
                      }
                    ]
                  ]
                }
              }
            }
          ]
        }
      })
    )
    .pipe(gulp.dest(distScriptsPath))
    .pipe(browserSync.stream());
}

function processFontsOtfToTtf() {
  if (!fs.existsSync(fontsFile)) {
    return gulp
      .src(`${srcFontsPath}/*.otf`, {})
      .pipe(
        plumber(
          notify.onError({
            title: 'FONTS',
            message: 'Error: <%= error.message %>'
          })
        )
      )
      .pipe(
        fonter({
          formats: ['ttf']
        })
      )
      .pipe(gulp.dest(`${srcFontsPath}`));
  } else {
    return gulp.src(`${srcPath}`);
  }
}

function processFontsTtfToWoff() {
  if (!fs.existsSync(fontsFile)) {
    return gulp
      .src(`${srcFontsPath}/*.ttf`)
      .pipe(
        plumber(
          notify.onError({
            title: 'FONTS',
            message: 'Error: <%= error.message %>'
          })
        )
      )
      .pipe(ttf2woff())
      .pipe(gulp.dest(`${distFontsPath}`))
      .pipe(gulp.src(`${srcFontsPath}/*.ttf`))
      .pipe(ttf2woff2())
      .pipe(gulp.dest(`${distFontsPath}`));
  } else {
    return gulp.src(`${srcPath}`);
  }
}

function processFontsStyle() {
  // eslint-disable-next-line no-empty-function
  function cb() {}
  fs.readdir(distFontsPath, (err, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i = 0; i < fontsFiles.length; i++) {
          const fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0]
              ? fontFileName.split('-')[0]
              : fontFileName;

            let fontWeight = fontFileName.split('-')[1]
              ? fontFileName.split('-')[1].toLowerCase()
              : fontFileName.toLowerCase();

            let fontStyle = 'normal';
            if (fontWeight.includes('italic')) {
              fontStyle = 'italic';
              fontWeight = fontWeight.substring(
                0,
                fontWeight.indexOf('italic')
              );
            }

            switch (fontWeight) {
              case 'thin':
                fontWeight = 100;
                break;
              case 'extralight':
                fontWeight = 200;
                break;
              case 'light':
                fontWeight = 300;
                break;
              case 'medium':
                fontWeight = 500;
                break;
              case 'semibold':
                fontWeight = 600;
                break;
              case 'bold':
                fontWeight = 700;
                break;
              case 'extrabold':
              case 'heavy':
                fontWeight = 800;
                break;
              case 'black':
                fontWeight = 900;
                break;
              default:
                fontWeight = 400;
            }

            fs.appendFile(
              fontsFile,
              // eslint-disable-next-line max-len
              `@font-face {\n  font-family: ${fontName};\n  font-display: swap;\n  src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n  font-weight: ${fontWeight};\n  font-style: ${fontStyle};\n}\r\n`,
              cb
            );
            newFileOnly = fontFileName;
          }
        }
      } else {
        console.log(
          // eslint-disable-next-line max-len
          'File scss/base/_fonts.scss already exists. Remove it if you want to update your fonts.'
        );
      }
    }
  });

  return gulp.src(`${srcPath}`);
}

function processPictures(srcPicturesFolder, distPicturesFolder, errorTitle) {
  return gulp
    .src(`${srcPicturesFolder}/**/*.{jpg,jpeg,png,gif,webp,svg}`)
    .pipe(
      plumber(
        notify.onError({
          title: errorTitle,
          message: 'Error: <%= error.message %>'
        })
      )
    )
    .pipe(newer(distPicturesFolder))
    .pipe(webp())
    .pipe(gulp.dest(distPicturesFolder))
    .pipe(gulp.src(`${srcPicturesFolder}/**/*`))
    .pipe(newer(distPicturesFolder))
    .pipe(
      imagemin([
        imageminPngquant({
          speed: 1,
          quality: [0.95, 1]
        }),
        imageminZopfli({
          more: true
        }),
        imageminGiflossy({
          optimizationLevel: 3,
          optimize: 3,
          lossy: 2
        }),
        imageminSvgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        }),
        imageminMozjpeg({
          quality: 90,
          progressive: true
        })
      ])
    )
    .pipe(gulp.dest(distPicturesFolder))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.parallel('dist-sync')();

  browserSync.init({
    server: distPath,
    port: bsPort,
    ui: {
      port: bsPort + 1
    },
    notify: true
  });

  gulp
    .watch(`${fixPathForGulpWatch(srcHtmlPath)}/**/*.html`)
    .on('all', gulp.parallel('html'));
  gulp.watch(
    `${fixPathForGulpWatch(srcStylesPath)}/**/*.+(scss|sass|css)`,
    gulp.parallel('styles')
  );
  gulp
    .watch(`${fixPathForGulpWatch(srcScriptsPath)}/**/*.js`)
    .on('change', gulp.parallel('scripts'));
  gulp
    .watch(`${fixPathForGulpWatch(srcFontsPath)}/**/*`)
    .on('all', gulp.parallel('fonts'));
  gulp
    .watch(`${fixPathForGulpWatch(srcIconsPath)}/**/*`)
    .on('all', gulp.parallel('icons'));
  gulp
    .watch(`${fixPathForGulpWatch(srcImagesPath)}/**/*`)
    .on('all', gulp.parallel('images'));
}

function processScriptsProd() {
  return gulp
    .src(`${srcScriptsPath}/**/*.js`)
    .pipe(
      webpackStream({
        mode: 'production',
        entry: scriptsToBundle,
        output: {
          filename: '[name].js',
          path: distScriptsPath
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: 3,
                        useBuiltIns: 'usage'
                      }
                    ]
                  ]
                }
              }
            }
          ]
        }
      })
    )
    .pipe(gulp.dest(distScriptsPath));
}
