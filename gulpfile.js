const gulp = require('gulp')
const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const noop = require('gulp-noop')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const nib = require('nib')
const sourcemaps = require('gulp-sourcemaps')
const rollup = require('gulp-rollup')
const browserSync = require('browser-sync').create()

// Types
const isDev = process.env.NODE_ENV === 'development'
const isModern = process.env.BROWSERS_ENV === 'modern'

/*
 * Server
 */

if ( isDev ) {
  gulp.task('serve',  function() {

    browserSync.init({
      ui: false,
      open: false,
      notify: false,
      server: ['./examples', './dist']
    })

    gulp.watch('./src/css/**/*.styl', gulp.series('build:styles'))
    gulp.watch(['./src/js/**/*.js', './src/vue/**/*.vue'], gulp.series('build:js', 'reload'))
    gulp.watch('./examples/**/*.html', gulp.series('reload'))
  })

  gulp.task('reload', function(done) { browserSync.reload(); done() })
}

/*
 * JS
 */

const rollupConfig = require('./rollup.config.js')
rollupConfig.allowRealFiles = true // solves gulp-rollup hipotetical file system problem
rollupConfig.rollup = require('rollup')

gulp.task('build:js', function(){
  return gulp.src('./src/js/main.js')
    .pipe( plumber() )
    .pipe( rollup(rollupConfig) )
    .pipe( gulp.dest('./dist/js') )
})


/*
 * Styles
 */

gulp.task('build:styles', function(){
  return gulp.src('./src/css/main.styl')
    .pipe( plumber() )
    .pipe( isDev ? sourcemaps.init() : noop() )
    .pipe( stylus({ use: nib(), 'include css': true, import: ['nib'], compress: false }) )
    .pipe( isDev ? noop() : postcss() )
    .pipe( isDev ? sourcemaps.write() : noop() )
    .pipe( gulp.dest('./dist/css') )
    .pipe( isDev ? browserSync.stream() : noop() )
})


/*
 * Gloabl tasks
 */
 
gulp.task('clean', function(){
  return gulp.src('./dist', { read: false, allowEmpty: true })
    .pipe( clean() )
})

gulp.task('build', gulp.series('build:js', 'build:styles') )

// start
defaultTask = ['build']
if ( ! isModern ) defaultTask.unshift('clean')
if ( isDev ) defaultTask.push('serve')
gulp.task('default', gulp.series(defaultTask) )
