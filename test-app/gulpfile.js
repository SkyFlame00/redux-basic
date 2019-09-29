const { src, dest, parallel } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const flatten = require('gulp-flatten');

function js() {
  return browserify('app/index.js')
    .bundle()
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(dest('./dist/'));
}

function css() {
  return src('blocks/**/*.scss')
    .pipe(scss().on('error', scss.logError))
    .pipe(concat('style.css'))
    .pipe(dest('dist/'));
}

function html() {
  return src('blocks/**/*.html')
    .pipe(flatten())
    .pipe(dest('dist/'));
}

module.exports = {
  build: parallel(js, css, html)
}