'use strict';

var _ = require('lodash'),
  runSequence = require('run-sequence'),
  gulp = require('gulp'),
  shell = require('gulp-shell'),
  copy = require('gulp-copy'),
  clean = require('gulp-clean');

// CLI for webpack dev
// http://webpack.github.io/docs/webpack-dev-server.html#cli
gulp.task('dev-webpack', shell.task(['webpack-dev-server --content-base ./public --colors']));
gulp.task('webpack', shell.task(['webpack --config webpack.config.min.js']));

gulp.task('copy-assets', (() => {
  return gulp.src(['./dist/**/**'])
    .pipe(copy('./public'));
}));

gulp.task('cleanup', (() => {
  return gulp.src(['./dist', './public/dist', '.awspublish-lightware'])
    .pipe(clean());
}));

gulp.task('publish', (() => {
  var config = require('./json/awsConfig'),
    awspublish = require('gulp-awspublish'),
    publisher = awspublish.create(config),
    publishReporterOptions = {'states': ['create', 'update', 'delete']},
    headers = {'Cache-Control': 'max-age=60, no-transform, public'};
  return gulp.src('./public/**/**')
    .pipe(publisher.publish(headers,{force:true}))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter(publishReporterOptions));
}));

gulp.task('aws-config', (() => {
  var fs = require('fs-extra'),
    file = './json/awsConfig.json',
    val = '{\n  "key": "AWSAccessKeyId",\n  "secret": "AWSSecretKey",\n  "bucket": "AWSBucketName"\n}';
  fs.createOutputStream(file);
  fs.outputFile(file, val, function (err) {
    console.log(err) // => null
  });
}));

gulp.task('build', (() => {
  return runSequence('webpack', 'copy-assets', 'publish', 'cleanup');
}));

gulp.task('default', ['dev-webpack']);