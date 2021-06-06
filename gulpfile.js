const {series, parallel, src, dest, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify= require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const imageOptim = require('gulp-imageoptim');


function clean(cb) {
    // body omitted
    cb();
}

function scssTranspile() {
     return src('dev/scss/core.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['./node_modules']
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(rename("core.css"))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

function jsTranspile() {
return src('dev/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}

function jsBundle(cb) {
// body omitted
cb();
}

function jsMinify(cb) {
// body omitted
cb();
}

function imageOptimise() {
    return src('dev/img/**.*')
    .pipe(imageOptim.optimize())
    .pipe(dest('dist/img'))
    .pipe(browserSync.stream());
}

function devServer() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    watch("dist/*.html").on('change', browserSync.reload);
    watch('dev/**.js', series(jsTranspile, jsBundle, jsMinify));
    watch('dev/**/*.scss', scssTranspile);
    watch('dev/img/**.*', imageOptimise);
}


exports.build = series(
clean,
parallel(
    scssTranspile,
    series(jsTranspile, jsBundle, jsMinify),
    imageOptimise
));

exports.dev = series(
    parallel(
        scssTranspile,
        series(jsTranspile, jsBundle, jsMinify),
        imageOptimise
    ),
    devServer
);