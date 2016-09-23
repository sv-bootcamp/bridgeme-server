const apidoc = require('gulp-apidoc');
const babel = require('gulp-babel');
const gulp = require('gulp');
const install = require('gulp-install');
const istanbul = require('gulp-istanbul');
const jscs = require('gulp-jscs');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const server = require('gulp-develop-server');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', () => {
  runSequence(['build:server', 'build:test', 'jscs'], 'server:start');
});

gulp.task('install', () => {
  gulp.src('./package.json')
    .pipe(install());
});

gulp.task('build', () => {
  runSequence('build:server', 'build:test');
});

gulp.task('build:server', () => {
  return gulp.src('./src/server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist-server'));
});

gulp.task('build:test', () => {
  return gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist-test'));
});

gulp.task('server:start', () => {
  server.listen({
    path: 'server',
  });
});

gulp.task('server:restart', () => {
  gulp.watch(['server'], server.restart);
});

gulp.task('pre-test',['build:test'], function () {
  return gulp.src(['dist-test/server/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src([
    'dist-test/test/*.js',
    'dist-test/test/controllers/users.controller.test.js',
    'dist-test/test/controllers/survey.controller.test.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 40 } }))
    .once('end', function () {
      process.exit();
    });
});

gulp.task('jscs', () => {
  return gulp.src('./src/**/*.js')
    .pipe(jscs({fix: true,}))
    .pipe(gulp.dest('src'));
});

gulp.task('apidoc', (done) => {
  apidoc({
    src: "src",
    dest: "apidoc/"
  }, done);
});

