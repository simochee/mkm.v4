import gulp from 'gulp';
import plumber from 'gulp-plumber';
import minifyCSS from 'gulp-minify-css';
import typescript from 'gulp-typescript';
import pug from 'gulp-pug';
import connect from 'gulp-connect';

gulp.task('connect', () => {
  connect.server({
    root: 'docs',
    livereload: true
  });
});

gulp.task('pug', () => {
  gulp.src('./src/views/**/!(_)*.pug', {
    base: 'src'
  })
  .pipe(plumber())
  .pipe(pug())
  .pipe(gulp.dest('./docs'));
});

gulp.task('ts', () => {
  gulp.src('./src/scripts/**/*.ts')
    .pipe(typescript({
      out: 'main.js'
    }))
    .pipe(gulp.dest('./docs/assets/scripts'))
});

gulp.task('watch', () => {
  gulp.watch('./src/views/**/!(_)*.pug', ['pug']);
  gulp.watch('./src/scripts/**/*.ts', ['ts']);
});

gulp.task('default', ['watch', 'connect', 'pug', 'ts']);