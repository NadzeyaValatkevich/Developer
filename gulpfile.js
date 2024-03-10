const { src, dest, watch, parallel, series} = require('gulp');
const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
// const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');
const deploy = require('gulp-gh-pages');
const sourcemaps = require('gulp-sourcemaps');
const ghPages = require('gh-pages');

function images() {
  return src(['app/images/**/*.{png,jpg}', '!app/images/icons/*.svg'])
    .pipe(newer('app/images'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('app/images/**/*.{png,jpg}'))
    .pipe(newer('app/images'))
    .pipe(webp())

    .pipe(src('app/images/**/*.{png,jpg}'))
    .pipe(newer('app/images'))
    .pipe(imagemin())

    .pipe(dest('app/images'))
}

function sprite() {
  return gulp.src('app/images/icons/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(gulp.dest('app/images'))
}

function scripts() {
  return src('app/js/*.js')
    .pipe(concat('*.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
    .pipe(concat('style.min.css'))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
  watch(['app/scss/style.scss'], styles)
  watch(['app/images'], images)
  watch(['app/js/*.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/images/**/*.*',
    '!app/images/*.svg',
    '!app/images/**/*.html',
    'app/images/sprite.svg',
    'app/fonts/*.*',
    'app/js/*.js',
    'app/**/*.html'
  ], { base: 'app' })
    .pipe(dest('dist'))
}

function deployToGitHubPages(cb) {
  ghPages.publish('dist', {
    branch: 'gh-pages',
    repo: 'https://github.com/NadzeyaValatkevich/Developer',
  }, cb);
  // return src('./dist/**/*')
  //   .pipe(deploy());
}

exports.scripts = scripts;
exports.styles = styles;
exports.sprite = sprite;
exports.watching = watching;
exports.building = building;
exports.images = images;



exports.deploy = series(deployToGitHubPages);
exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, watching);


