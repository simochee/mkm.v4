import gulp from 'gulp';
import plumber from 'gulp-plumber';
import minifyCSS from 'gulp-minify-css';
import typescript from 'gulp-typescript';
import ejs from 'gulp-ejs';
import connect from 'gulp-connect';
import concat from 'gulp-concat';
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
  gulp.src([
    './src/scripts/app.ts',
    './src/scripts/controllers.ts'
  ])
  .pipe(typescript({
    out: 'main.js'
  }))
  .pipe(gulp.dest('./docs/assets/scripts'))
});

gulp.task('libs', () => {
  gulp.src([
    './node_modules/angular/angular.js',
    './node_modules/angular-sanitize/angular-sanitize.js',
    './node_modules/angular-resource/angular-resource.js'
  ])
  .pipe(concat('libs.js'))
  .pipe(gulp.dest('./docs/assets/scripts'));
});

gulp.task('public', () => {
  gulp.src('./src/public/**/*', {
    base: 'src/public'
  })
  .pipe(gulp.dest('./docs/assets'));
})

gulp.task('watch', () => {
  gulp.watch('./src/ejs/**/*.ejs', ['ejs']);
  gulp.watch('./src/scripts/**/*.ts', ['ts']);
  gulp.watch('./src/public/**/*', ['public']);
});

gulp.task('default', ['watch', 'connect', 'ejs', 'ts', 'public']);