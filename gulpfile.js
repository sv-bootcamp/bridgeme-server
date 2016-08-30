const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const server = require('gulp-develop-server');
const runSequence = require('run-sequence');
const install = require('gulp-install');
const apidoc = require('gulp-apidoc');
const jscs = require('gulp-jscs');
const originalJs = './src/**/**/*.js';

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

gulp.task('test:index', () => {
  return gulp.src(['./dist-server/test/index.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));

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
