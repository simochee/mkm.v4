import gulp from 'gulp';
import plumber from 'gulp-plumber';
import minifyCSS from 'gulp-minify-css';
import typescript from 'gulp-typescript';
import ejs from 'gulp-ejs';
import connect from 'gulp-connect';
import fs from 'fs';

gulp.task('connect', () => {
  connect.server({
    root: 'docs',
    livereload: true
  });
});

gulp.task('ejs', () => {
  const json = JSON.parse(fs.readFileSync('package.json'));
  gulp.src('./src/ejs/**/!(_)*.ejs', {
    base: 'src/ejs'
  })
  .pipe(plumber())
  .pipe(ejs(json, {'ext': '.html'}))
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
  gulp.watch('./src/views/**/!(_)*.ejs', ['ejs']);
  gulp.watch('./src/scripts/**/*.ts', ['ts']);
});

gulp.task('default', ['watch', 'connect', 'ejs', 'ts']);