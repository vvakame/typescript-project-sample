/// <reference path="./typings/gulp/gulp.d.ts" />

import * as gulp from "gulp";

let tsconfig = require("gulp-tsconfig-update");
let tslint = require("gulp-tslint");
let shell = require("gulp-shell");
let runSequence = require("run-sequence").use(gulp);

let espower = require("gulp-espower");
let mocha = require("gulp-mocha");

gulp.task("tsconfig", () => {
    gulp
        .src([
            "./lib/**/*.ts",
            "!./lib/**/*.d.ts",
            "./test/**/*.ts",
            "!./test/**/*.d.ts",
            "./typings/**/*.ts",
            "./node_modules/commandpost/commandpost.d.ts",
            "./node_modules/typescript/bin/lib.es6.d.ts"
        ])
        .pipe(tsconfig());
});

gulp.task("tsc", shell.task([
    "node_modules/.bin/tsc -p ./"
]));

gulp.task("tslint", () => {
    gulp
        .src([
            "./lib/**/*.ts",
            "./test/**/*.ts"
        ])
        .pipe(tslint({
            config: "/tslint.json"
        }))
        .pipe(tslint.report("verbose"));
});

gulp.task("espower", () => {
    gulp
        .src([
            "./test/**/*.js"
        ])
        .pipe(espower())
        .pipe(gulp.dest("./espowered"));
});

gulp.task("test", () => {
    gulp
        .src([
            "./lib/**/*.js",
            "!./lib/cli.js",
            "./espowered/**/*.js"
        ])
        .pipe(mocha());
});

gulp.task("default", (cb: Function) => {
    runSequence("tsconfig", "tsc", "tslint", "espower", "test", cb);
});
