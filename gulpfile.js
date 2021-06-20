const {series, parallel, src, dest, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const webpackStream = require('webpack-stream');
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
        .pipe(dest('docs'))
        .pipe(browserSync.stream());
}

function jsTranspile() {
return src('./dev/js/core.js')
    .pipe(webpackStream({
        devtool: 'source-map',
        entry: './dev/js/core.js',
        mode: 'development',
        output: {
            filename: 'combined.min.js'
        }
    }))
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
    // .pipe(uglify())
    .pipe(dest('./docs/'))
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
    .pipe(dest('docs/img'))
    .pipe(browserSync.stream());
}

function devServer() {
    browserSync.init({
        server: {
            baseDir: "docs"
        }
    });
    watch("docs/*.html").on('change', browserSync.reload);
    watch('dev/**/*.js', series(jsTranspile, jsBundle, jsMinify));
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