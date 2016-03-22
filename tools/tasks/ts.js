import config from '../config';
import gulp from 'gulp';
import { join } from 'path';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import tsProjectFn from '../utils/ts-project';
import typescript from 'gulp-typescript';
import { bs } from './browser-sync';
import gulpIf from 'gulp-if';
import uglify from 'gulp-uglify';

const paths = {
  src: [
    'typings/browser.d.ts',
    'tools/manual-typings/**/*.d.ts',
    join(config.SRC_DIR, config.ts.src, config.ts.glob)
  ],
  dest: join(config.DEST_DIR, config.ts.dest)
};

const preTasks = (!config.tsLint.ideSupport && config.isDev) ? ['ts-lint'] : [];
const tsProject = tsProjectFn();

gulp.task('ts', preTasks, () => {
  const result = gulp
    .src(paths.src)
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(typescript(tsProject));

  return result
    .js
    .pipe(gulpIf(config.isProd, uglify()))
    .pipe(sourcemaps.write(config.isProd ? '.' : ''))
    .pipe(gulp.dest(paths.dest))
    .pipe(gulpIf(config.isDev, bs.stream({once: true})));
});