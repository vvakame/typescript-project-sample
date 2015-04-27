module.exports = function (grunt) {
	require("time-grunt")(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		opt: {
			"client": {
				"tsMain": "client/scripts",
				"tsMainLib": "client/scripts/libs",
				"tsTest": "client-test",
				"scss": "client/css",
				"jsLib": "client/scripts/libs",

				"jsMainOut": "client/scripts",
				"jsTestOut": "client-test",
				"jsEspowerOut": "client-test-espowered",
				"cssOut": "client/css"
			},
			"server": {
				"tsMain": "server",
				"tsMainLib": "server/libs",
				"tsTest": "server-test",

				"jsMainOut": "server",
				"jsTestOut": "server-test"
			}
		},

		ts: {
			options: {
				compile: true,                 // perform compilation. [true (default) | false]
				comments: false,               // same as !removeComments. [true | false (default)]
				target: 'es5',                 // target javascript language. [es3 (default) | es5]
				noImplicitAny: true,
				sourceMap: false,              // generate a source map for every output js file. [true (default) | false]
				sourceRoot: '',                // where to locate TypeScript files. [(default) '' == source ts location]
				mapRoot: '',                   // where to locate .map.js files. [(default) '' == generated js location.]
				declaration: false             // generate a declaration .d.ts file for every output js file. [true | false (default)]
			},
			clientMain: {
				src: ['<%= opt.client.tsMain %>/Main.ts'],
				out: '<%= opt.client.jsMainOut %>/main.js'
			},
			clientTest: {
				src: ['<%= opt.client.tsTest %>/MainSpec.ts'],
				out: '<%= opt.client.jsTestOut %>/main-spec.js'
			},
			serverMain: {
				src: ['<%= opt.server.tsMain %>/app.ts'],
				options: {
					module: 'commonjs',            // target javascript module style. [amd (default) | commonjs]
				}
			},
			serverTest: {
				src: ['<%= opt.server.tsTest %>/api-spec.ts'],
				out: '<%= opt.server.jsTestOut %>/api-spec.js'
			}
		},
		tslint: {
			options: {
				formatter: "prose",
				configuration: grunt.file.readJSON("tslint.json")
			},
			files: {
				src: [
					'<%= opt.client.tsMain %>/**/*.ts',
					'<%= opt.client.tsTest %>/**/*.ts',
					'<%= opt.server.tsMain %>/**/*.ts',
					'<%= opt.server.tsTest %>/**/*.ts'
				],
				filter: function (filepath) {
					var mainClientLib = grunt.config.get("opt.client.tsMainLib") + "/";
					var mainServerLib = grunt.config.get("opt.server.tsMainLib") + "/";
					var libs = [mainClientLib, mainServerLib];

					function isLib(lib) {
						return filepath.indexOf(lib) !== -1;
					}

					if (libs.some(isLib)) {
						return false;
					} else {
						return true;
					}
				}
			}
		},
		typedoc: {
			main: {
				options: {
					// module: "<%= ts.options.module %>",
					out: './docs',
					name: '<%= pkg.name %>',
					target: '<%= ts.options.target %>'
				},
				src: [
					'<%= opt.client.tsMain %>/**/*'
				]
			}
		},
		espower: {
			client: {
				files: [
					{
						expand: true,				// Enable dynamic expansion.
						cwd: '<%= opt.client.jsTestOut %>/',				// Src matches are relative to this path.
						src: ['**/*.js'],		// Actual pattern(s) to match.
						dest: '<%= opt.client.jsEspowerOut %>/',	// Destination path prefix.
						ext: '.js'					 // Dest filepaths will have this extension.
					}
				]
			}
		},
		compass: {
			dev: {
				options: {
					sassDir: '<%= opt.scss %>',
					cssDir: '<%= opt.cssOut %>',
					imagesDir: '<%= opt.imageOut %>',
					javascriptsDir: '<%= opt.jsMainOut %>',
					noLineComments: false,
					debugInfo: true,
					relativeAssets: true
				}
			},
			prod: {
				options: {
					environment: 'production',
					sassDir: '<%= opt.scss %>',
					cssDir: '<%= opt.cssOut %>',
					imagesDir: '<%= opt.imageOut %>',
					javascriptsDir: '<%= opt.jsMainOut %>',
					noLineComments: true,
					debugInfo: false,
					relativeAssets: true
				}
			}
		},
		bower: {
			install: {
				options: {
					targetDir: 'bower-task',
					layout: 'byType', // exportsOverride の左辺に従って分類
					install: true,
					verbose: true, // ログの詳細を出すかどうか
					cleanTargetDir: true,
					cleanBowerDir: false
				}
			}
		},
		tsd: {
			client: {
				options: {
					// execute a command
					command: 'reinstall',

					//optional: always get from HEAD
					latest: false,

					// optional: specify config file
					config: './tsd-client.json'
				}
			},
			server: {
				options: {
					// execute a command
					command: 'reinstall',

					//optional: always get from HEAD
					latest: false,

					// optional: specify config file
					config: './tsd-server.json'
				}
			}
		},
		copy: {
			bower: {
				files: [
					{
						expand: true,
						flatten: true,
						cwd: 'bower-task/',
						src: ['main-js/**/*.js'],
						dest: '<%= opt.client.jsLib %>/'
					},
					{
						expand: true,
						flatten: true,
						cwd: 'bower-task/',
						src: ['test-js/**/*.js', 'test-css/**/*.css'],
						dest: '<%= opt.client.tsTest %>/libs/'
					}
				]
			},
			app: {
				files: {
					"app.js": "<%= opt.server.jsMainOut %>/app.js"
				}
			}
		},
		clean: {
			build: {
				src: [
					// server
					'app.js',
					'<%= opt.server.jsMainOut %>/*.js',
					'<%= opt.server.jsMainOut %>/*.d.ts',
					'<%= opt.server.jsMainOut %>/*.js.map',
					// server test
					'<%= opt.server.jsTestOut %>/*.js',
					'<%= opt.server.jsTestOut %>/*.d.ts',
					'<%= opt.server.jsTestOut %>/*.js.map',
					// client
					'<%= opt.client.cssOut %>/style.css',
					'<%= opt.client.jsMainOut %>/*.js',
					'<%= opt.client.jsMainOut %>/*.d.ts',
					'<%= opt.client.jsMainOut %>/*.js.map',
					// client test
					'<%= opt.client.jsTestOut %>/*.js',
					'<%= opt.client.jsTestOut %>/*.d.ts',
					'<%= opt.client.jsTestOut %>/*.js.map',
					'<%= opt.client.jsEspowerOut %>/'
				]
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: [
						function () {
							require('espower-loader')({
								cwd: process.cwd() + '/' + grunt.config.get("opt.server.jsTestOut"),
								pattern: '**/*.js'
							});
						},
						function () {
							assert = require('power-assert');
						}
					]
				},
				src: [
					'<%= opt.server.jsMainOut %>/**/*.js',
					'<%= opt.server.jsTestOut %>/**/*.js'
				]
			}
		},
		karma: {
			all: {
				options: {
					configFile: 'karma.conf.js',
					browsers: ['PhantomJS'],
					reporters: ['progress', 'junit'],
					autoWatch: false,
					singleRun: true,
					keepalive: true
				}
			}
		}
	});

	grunt.registerTask('setup', ['clean', 'bower', 'tsd']);
	grunt.registerTask('default', ['clean', 'ts', 'tslint', 'copy', 'compass']);
	grunt.registerTask('test', ['clean', 'ts', 'copy', 'espower', 'karma', 'mochaTest']);

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
