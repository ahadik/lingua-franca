'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sourcemaps = require('gulp-sourcemaps'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    importOnce = require('node-sass-import-once'),
    autoprefixer = require('gulp-autoprefixer'),
    sasslint = require('gulp-sass-lint'),
    imagemin = require('gulp-imagemin'),
    cfenv = require('cfenv'),
    webpack = require('webpack'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    browserSync = require('browser-sync'),
    babel = require('gulp-babel');

//////////////////////////////
// Variables
//////////////////////////////
var dirs = {
  'js': {
    'lint': [
      'app.js',
      'src/**/*.js',
      'modules/**/*.js',
      '!src/**/*.min.js'
    ],
    'client': {
      'main':'./src/js/script.js',
      'watch':'./src/**/*.js'
    },
    'server': {
      'main': './app.js',
      'watch': [
        'app.js',
        'modules/**/*.js'
      ]
    }
  },
  'sass': 'src/sass/**/*.scss',
  'images': {'imgs': 'src/imgs/**/*', 'icons' : 'src/icons/**/*'},
  'html': 'src/**/*.html'
};

var isCI = (typeof process.env.CI === 'undefined') ? process.env.CI : false;

//////////////////////////////
// Update BrowserSync
//////////////////////////////
browserSync = browserSync.create();

//////////////////////////////
// JavaScript Lint Tasks
//////////////////////////////

//Pack all client side JS
gulp.task('client-pack', (cb) => {
  webpack({
    devtool: 'source-maps',
    entry: dirs.js.client.main,
    output: {
      path: './public/js',
      filename: 'script.js'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        },
      ],
    },
    plugins: [new webpack.optimize.UglifyJsPlugin()],
  }, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      progress: true,
      colors: true
    }));
    browserSync.reload();
    cb();
  });
});

//watch all client side JS and trigger client-side pack on change
gulp.task('client-pack:watch', function(){
  gulp.watch(dirs.js.client.watch, ['client-pack']);
});

var nodeExternals = require('webpack-node-externals');

//Pack all server side JS
gulp.task('server-pack', (cb) => {
  webpack({
    devtool: 'source-maps',
    'target':'node',
    externals: [nodeExternals()],
    entry: dirs.js.server.main,
    output: {
      path: './',
      filename: 'index.js'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        },
      ],
    }
  }, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      progress: true,
      colors: true
    }));
    cb();
  });
});

//watch all server side JS and trigger server-side pack on change
gulp.task('server-pack:watch', function(){
  gulp.watch(dirs.js.server.watch, ['server-pack']);
});

//Run the linter on all files marked for linting
gulp.task('eslint', function () {
  gulp.src(dirs.js.lint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(isCI, eslint.failOnError()));
});

gulp.task('eslint:watch', function () {
  gulp.watch(dirs.js.lint, ['eslint']);
});

//////////////////////////////
// HTML Tasks
//////////////////////////////
gulp.task('html', function() {
  gulp.src(dirs.html)
    .pipe(gulp.dest(dirs.public))
    .pipe(browserSync.stream());
})

gulp.task('html:watch', function () {
  gulp.watch(dirs.html, ['html']);
});


//////////////////////////////
// Sass Tasks
//////////////////////////////
gulp.task('sass', function () {
  gulp.src(dirs.sass)
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(gulpif(isCI, sasslint.failOnError()))
    .pipe(gulpif(!isCI, sourcemaps.init()))
      .pipe(sass({
        'outputStyle': isCI ? 'expanded' : 'compressed',
        'includePaths': [
          'bower_components/**/*'
        ],
        'importer': importOnce,
        'importOnce': {
          'index': true,
          'css': true,
          'bower': true
        }
      }))
      .pipe(autoprefixer())
    .pipe(gulpif(!isCI, sourcemaps.write('maps')))
    .pipe(gulp.dest(dirs.public + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  gulp.watch(dirs.sass, ['sass']);
});

//////////////////////////////
// Image Tasks
//////////////////////////////
gulp.task('images', function () {
  gulp.src(dirs.images.imgs)
    .pipe(imagemin({
      'progressive': true,
      'svgoPlugins': [
        { 'removeViewBox': false }
      ]
    }))
    .pipe(gulp.dest(dirs.public + '/imgs'));

    gulp.src(dirs.images.icons)
    .pipe(imagemin({
      'progressive': true,
      'svgoPlugins': [
        { 'removeViewBox': false }
      ]
    }))
    .pipe(gulp.dest(dirs.public + '/icons'));
});

gulp.task('images:watch', function () {
  gulp.watch([dirs.images.imgs, dirs.images.icons], ['images']);
});

//////////////////////////////
// Nodemon Task
//////////////////////////////
gulp.task('nodemon', function (cb) {
  nodemon({
    'script': dirs.js.server.main,
    'watch': dirs.js.server.watch,
    'env': {
      'NODE_ENV': 'development'
    }
  })
  .once('start', function () {
    cb();
  })
  .on('restart', function () {
    // console.log('Restarted');
  });
});

//////////////////////////////
// Browser Sync Task
//////////////////////////////
gulp.task('browser-sync', ['nodemon'], function () {
  var appEnv = cfenv.getAppEnv();
  appEnv.url = 'http://localhost:3000/';
  browserSync.init({
  port: 8000,
    'proxy': appEnv.url
  });
});

//////////////////////////////
// Running Tasks
//////////////////////////////
gulp.task('build', ['client-pack', 'server-pack', 'eslint', 'html', 'sass', 'images']);

gulp.task('test', ['build']);

gulp.task('watch', ['client-pack:watch', 'server-pack:watch', 'eslint:watch', 'html:watch', 'sass:watch', 'images:watch']);

gulp.task('default', ['browser-sync', 'build', 'watch']);
