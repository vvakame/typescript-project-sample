module.exports = function(grunt) {
	require("time-grunt")(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Java用プロジェクト構成向け設定
		opt: {
			client: {
				"tsMain": "lib",
				"tsMainLib": "lib/typings",
				"tsTest": "test",

				"jsMainOut": "lib",
				"jsTestOut": "test"
			}
		},

		ts: {
			options: {
				compile: true,                 // perform compilation. [true (default) | false]
				comments: false,               // same as !removeComments. [true | false (default)]
				target: 'es5',                 // target javascript language. [es3 (default) | es5]
				module: 'commonjs',            // target javascript module style. [amd (default) | commonjs]
				noImplicitAny: true,
				sourceMap: false,              // generate a source map for every output js file. [true (default) | false]
				sourceRoot: '',                // where to locate TypeScript files. [(default) '' == source ts location]
				mapRoot: '',                   // where to locate .map.js files. [(default) '' == generated js location.]
				declaration: false,            // generate a declaration .d.ts file for every output js file. [true | false (default)]
				experimentalDecorators: true
			},
			clientCli: {
				src: ['<%= opt.client.tsMain %>/cli.ts']
			},
			clientMain: {
				src: ['<%= opt.client.tsMain %>/index.ts'],
				options: {
					declaration: true
				}
			},
			clientTest: {
				src: ['<%= opt.client.tsTest %>/indexSpec.ts']
			}
		},
		tslint: {
			options: {
				configuration: grunt.file.readJSON("tslint.json")
			},
			files: {
				src: [
					'<%= opt.client.tsMain %>/**/*.ts',
					'<%= opt.client.tsTest %>/**/*.ts',
					'!<%= opt.client.tsMain %>/**/*.d.ts'
				]
			}
		},
		typedoc: {
			main: {
				options: {
					module: "<%= ts.options.module %>",
					out: './docs',
					name: '<%= pkg.name %>',
					target: "<%= ts.options.target %>"
				},
				src: [
					'<%= opt.client.tsMain %>/**/*.ts',
					'!<%= opt.client.tsMain %>/cli.ts' // main.d.ts読み込んでて重複が発生するので
				]
			}
		},
		dtsm: {
			client: {
				options: {
					// optional: specify config file
					confog: './dtsm.json'
				}
			}
		},
		dts_bundle: {
			build: {
				options: {
					name: "typescript-project-sample",
					main: "lib/index.d.ts",
					baseDir: "",
					out: "./typescript-project-sample.d.ts",
					prefix: '',
					exclude: function() { return false; },
					verbose: false
				}
			}
		},
		clean: {
			clientScript: {
				src: [
				// client
					'<%= opt.client.jsMainOut %>/**/*.js',
					'<%= opt.client.jsMainOut %>/**/*.d.ts',
					'<%= opt.client.jsMainOut %>/**/*.js.map',
					'!<%= opt.client.jsMainOut %>/typings/**/*.d.ts',
				// client test
					'<%= opt.client.jsTestOut %>/*.js',
					'<%= opt.client.jsTestOut %>/suite/**/*.js',
					'<%= opt.client.jsTestOut %>/suite/**/*.js.map',
					'<%= opt.client.jsTestOut %>/suite/**/*.d.ts'
				]
			},
			dtsm: {
				src: [
				// dtsm installed
					"typings/"
				]
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: [
						function() {
							require('espower-loader')({
								cwd: process.cwd() + '/' + grunt.config.get("opt.client.jsTestOut"),
								pattern: '**/*.js'
							});
						},
						function() {
							assert = require('power-assert');
						}
					]
				},
				src: [
					'<%= opt.client.jsTestOut %>/suite/indexSpec.js'
				]
			}
		}
	});

	grunt.registerTask(
		'setup',
		['clean', 'dtsm', 'tsconfig']);

	grunt.registerTask(
		'default',
		['clean:clientScript', 'ts:clientMain', 'tslint']);

	grunt.registerTask(
		'test-preprocess',
		"テストに必要な前準備を実行する。",
		['default', 'ts:clientTest', 'browserify:test']);

	grunt.registerTask(
		'test',
		['default', 'ts:clientTest', 'mochaTest']);

	require('load-grunt-tasks')(grunt);
};
