"use strict";

var gulp = require("gulp"),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    gutil = require("gulp-util"),
    del = require("del"),
    runSequence = require("run-sequence"),
    stylus = require("gulp-stylus");

var options = {
    src: "src",
    dist: "dist",
    test: "test"
}

var errorHandler = function (title) {
  return function(err) {
    gutil.log(gutil.colors.red("[" + title + "]"), err.toString());
    this.emit("end");
  };
};

gulp.task("build:css", function(){
    return gulp.src(options.src + "/underlayer.styl")
        .pipe(sourcemaps.init())
        .pipe(stylus({
          "include css": true
        }))
        .on("error", errorHandler("stylus error"))
        .pipe(autoprefixer({
            browsers: ["last 10 versions"],
            cascade: false }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(options.test + "/css"))
        .pipe(browserSync.stream())
        .on("error", gutil.log);
})


gulp.task("clean", function(){
    return del("test/css");
})


gulp.task("build", function() {
    runSequence("clean","build:css")
});


gulp.task("test", ["build"], function() {

    browserSync.init({
        server: options.test,
        ogFileChanges: true
    });

  // Watch app .styl files, changes are piped to browserSync
  gulp.watch(options.src + "/**/*.styl", ["build:css"]);

  // Watch test html files
  gulp.watch(options.test + "/**/*.html", ["build:css"]);
});




