const apidoc = require('gulp-apidoc');
const babel = require('gulp-babel');
const env = require('gulp-env');
const envFile = require('node-env-file');
const fs = require('fs');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const install = require('gulp-install');
const istanbul = require('gulp-istanbul');
const jscs = require('gulp-jscs');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', () => {
  runSequence(['build', 'jscs', 'apidoc'], 'server:development');
});

gulp.task('prod', () => {
  runSequence(['build', 'apidoc'], 'server:production');
});

gulp.task('test', ['pre-test'], () => {
  if (fs.existsSync('./env.test.list')) {
    envFile('./env.test.list');
  }

  return gulp.src([
    'dist-test/test/utils.js',
    'dist-test/test/controllers/users.controller.test.js',
    'dist-test/test/controllers/survey.controller.test.js',
    'dist-test/test/controllers/tournament.controller.test.js',
    'dist-test/test/controllers/match.controller.test.js',
    'dist-test/test/controllers/users.signout.test.js',])
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 40 } }))
    .once('end', () => {
      process.exit();
    });
});

gulp.task('build', () => {
  return gulp.src('./src/server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist-server'));
});

gulp.task('build:test', () => {
    const envs = env.set({
      NODE_ENV: 'test',
    });
    return gulp.src('./src/**/*.js')
      .pipe(envs)
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015'],
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist-test'));
  });

gulp.task('server:development', () => {
  envFile('./env.dev.list');
  nodemon({
    script: 'server.js',
    env: { NODE_ENV: 'development' },
    watch: 'src',
    tasks: ['build'],
  });
});

gulp.task('server:production', () => {
  envFile('./env.prod.list');
  nodemon({
    script: 'server.js',
    env: { NODE_ENV: 'production' },
  });
});

gulp.task('pre-test', ['build:test'], () => {
  return gulp.src(['dist-test/server/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('install', () => {
  gulp.src('./package.json')
    .pipe(install());
});

gulp.task('jscs', () => {
  return gulp.src('./src/**/*.js')
    .pipe(jscs({ fix: true, }))
    .pipe(gulp.dest('src'));
});

gulp.task('apidoc', (done) => {
  apidoc({
    src: 'src',
    dest: 'dist-server/apidoc/',
  }, done);
});

