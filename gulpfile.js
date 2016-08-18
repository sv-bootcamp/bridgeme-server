const gulp			= require('gulp');
const babel 		= require('gulp-babel');
const watch 		= require('gulp-nodemon');
const eslint		= require('gulp-eslint');
const sourcemaps	= require('gulp-sourcemaps');
const server		= require( 'gulp-develop-server');
const runSequence	= require('run-sequence');
const install		= require("gulp-install");

const originalJs	= './src/**/**/*.js';

gulp.task( 'server:start', () => {
    server.listen( { path: './dist-server/server.js' } );
});
 
gulp.task( 'server:restart', () => {
    gulp.watch( [ './dist-server/server.js' ], server.restart );
});

gulp.task('babel', () => {
	return gulp.src(originalJs)
	    .pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
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
		.pipe(eslint({configFile : './.eslintrc.json'}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('default', () => {
	runSequence('install','babel','server:start');
});