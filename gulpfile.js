const apidoc = require('gulp-apidoc');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const install = require('gulp-install');
const jscs = require('gulp-jscs');
const mocha = require('gulp-mocha');
const originalJs = './src/**/**/*.js';
const runSequence = require('run-sequence');
const server = require('gulp-develop-server');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('server:start', () => {
  server.listen({
    path: './dist-server/server.js',
  });
});

gulp.task('server:restart', () => {
  gulp.watch(['./dist-server/server.js'], server.restart);
});

gulp.task('babel', () => {
  return gulp.src(originalJs)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist-server'));
});

gulp.task('install', () => {
  gulp.src('./package.json')
    .pipe(install());
});

gulp.task('lint', () => {
  return gulp.src(originalJs)
    .pipe(eslint({
      configFile: './.eslintrc.json',
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('apidoc', (done) => {
  apidoc({
    src: 'src/',
    dest: 'apidoc/',
  }, done);
});

gulp.task('test:mocha', function() {
  return gulp.src(['dist-server/test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('test', () => {
  runSequence('babel','test:mocha');
});

gulp.task('jscs', () => {
  return gulp.src('src/**/*.js')
    .pipe(jscs({ fix: true }))
    .pipe(gulp.dest('src'));
});

gulp.task('default', () => {
  runSequence('babel', 'server:start');
});
