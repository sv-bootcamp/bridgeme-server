const apidoc = require('gulp-apidoc');
const babel = require('gulp-babel');
const gulp = require('gulp');
const install = require('gulp-install');
const jscs = require('gulp-jscs');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const server = require('gulp-develop-server');
const sourcemaps = require('gulp-sourcemaps');


gulp.task('default', () => {
  runSequence(['build:server','build:test', 'jscs'], 'server:start');
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

gulp.task('test', () => {
  runSequence('jscs','build','test:all');
});

gulp.task('test:all', () => {
  return gulp.src(['dist-test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('jscs', () => {
  return gulp.src('./src/**/*.js')
    .pipe(jscs({ fix: true, }))
    .pipe(gulp.dest('src'));
});

gulp.task('apidoc', (done) => {
  apidoc({
    src: "src",
    dest: "apidoc/"
  },done);
});

