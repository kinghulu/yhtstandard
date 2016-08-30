'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');

var u_app='app/'; //app
var u_sass=u_app+'scss/'; //sass
var u_css=u_app+'css/'; //css
var u_js=u_app+'js/'; //js
var u_images=u_app+'images/'; //images
var dist='dist';   //生成目录
var staticfile={
    develop:"./develop"
}

//sass编译
gulp.task('sass',['cleanTmp'], function () {
    return gulp.src(u_sass+'**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(".tmp/css"))
    .pipe(reload({stream: true}));
});


//修正浏览器前缀
gulp.task('autofx',['sass'], function () {
    return gulp.src(".tmp/css/*.css")
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(u_css));
});

//压缩CSS
gulp.task('cssmin',['autofx'], function () {
    return gulp.src(u_css)
        .pipe(cleanCSS({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            //compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '1'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest(dist+'/css'));
});

//压缩html
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,  //清除HTML注释
        collapseWhitespace: true,  //压缩HTML
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,  //压缩页面JS
        minifyCSS: true  //压缩页面CSS
    };
    return gulp.src(u_app+'**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(dist));
});

//压缩图片
gulp.task('imagemin', function () {
    return gulp.src(u_images+'*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(dist+'/images'));
});


//压缩js
gulp.task('jsmin', function () {
    return gulp.src(u_js+'*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: true//类型：Boolean 默认：true 是否修改变量名
            ,compress: true//类型：Boolean 默认：true 是否完全压缩
            //,preserveComments: 'all' //保留所有注释
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist+'/js'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('cleanTmp', del.bind(null, ['.tmp']));
gulp.task('cleandev', del.bind(null, [staticfile.develop]));

//拷贝图片到开发版
gulp.task('copydevimg',['imagemin'], function () {
    return gulp.src(dist+'/images/*.{png,jpg,gif,ico}')
        .pipe(gulp.dest(staticfile.develop+'/images'));
});
//拷贝样式到开发版
gulp.task('copydevcss',['cssmin'], function () {
    return gulp.src(dist+'/css/*.css')
        .pipe(gulp.dest(staticfile.develop+'/css'));
});
//拷贝js到开发版
gulp.task('copydevjs', function () {
    return gulp.src(u_js+'*.js')
        .pipe(gulp.dest(staticfile.develop+'/js'));
});
//拷贝html到开发版
gulp.task('copydevhtml', function () {
    return gulp.src(u_app+'*.html')
        .pipe(gulp.dest(staticfile.develop));
});


// 监视文件改动并重新载入
gulp.task('serve',['autofx'],function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
    gulp.watch([u_app+'*.html', u_css+'**/*.css', u_js+'**/*.js'], reload);
    gulp.watch([u_sass+'**/*.scss'],['autofx']);
});

// 拷贝目录开发版
gulp.task('copydev',['cleandev'],function() {
    return gulp.start(['copydevimg','copydevcss','copydevjs','copydevhtml']);
});

// 打包项目
gulp.task('build',['clean'],function() {
    return gulp.start(['cssmin','jsmin','htmlmin','imagemin']);
});

// 生成开发版
gulp.task('develop',['copydev'],function() {
    return gulp.start(['cleanTmp']);
});

gulp.task('default', ['serve']);