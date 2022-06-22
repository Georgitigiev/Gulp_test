const{src, dest,watch,parallel,series} = require('gulp');
const less = require("gulp-less");
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const Uglify = require("gulp-uglify")
const Concat = require("gulp-concat")
const babel = require("gulp-babel")


const paths = {
   styles:{
      src: "src/less/**/*.less",
      dest: "dist/css"
   },
   scripts:{
      src: "src/js/**/*.js",
      dest: "dist/js"
   },
   html:{
      src:"src/index.html",
      dest:"dist/"
   }
}

const browsersync = () =>{
   browserSync.init({
       server: { baseDir:'dist/'}
   })
}

const startHtml = ()=>{
   return src(paths.html.src)
         .pipe(dest(paths.html.dest))
         .pipe(browserSync.stream())
}


const styles = () => {
   return src(paths.styles.src)
         .pipe(less())
         .pipe(autoprefixer())
         .pipe(cleancss())
         .pipe(rename({
            basename:'main',
            suffix:'.min'
         }))
         .pipe(dest(paths.styles.dest))
         .pipe(browserSync.stream())
}

const scripts = () =>{
   return src(paths.scripts.src)
      .pipe(Concat("main.min.js"))
      .pipe(babel({
         presets: ['@babel/env']
         }))
      .pipe(Uglify())
      .pipe(dest(paths.scripts.dest))
}




const StarWatch = () => {
   watch(paths.styles.src, styles)
   watch(paths.html.src, startHtml)
   watch(paths.scripts.src, scripts)
}

// exports.styles = styles
// exports.StarWatch = StarWatch


exports.default = parallel(browsersync,startHtml,styles,scripts,StarWatch);