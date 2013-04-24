module.exports = function (grunt) {
	grunt.initConfig({
		typescript: {
			client: { // --declarations --sourcemap --target ES5 --out client/scripts/main.js client/scripts/main.ts
				src: ['client/scripts/main.ts'],
				dest: 'client/scripts/main.js',
				options: {
					target: 'es5',
					sourcemap: true,
					declaration: true
				}
			},
			client_test: {
				src: ['client-test/main-spec.ts'],
				options: {
					target: 'es5',
					sourcemap: true,
					declaration: true
				}
			},
			server: { // --target ES5 --module Node server/app.ts
				src: ['server/app.ts'],
				options: {
					target: 'es5',
					module: 'Node',
					sourcemap: true,
					declaration: true
				}
			},
			server_test: {
				src: ['server-test/api-spec.ts'],
				dest: 'server-test/api-spec.js',
				options: {
					target: 'es5',
					module: 'Node',
					sourcemap: true,
					declaration: true
				}
			}
		},
		copy: {
			dist: {
				files: {
					"app.js": "server/app.js"
				}
			}
		},
		less: {
			development: {
				options: {
					paths: ['client/css']
				},
				files: {
					'client/css/style.css': 'client/css/**/*.less'
				}
			}
		},
		watch: {
			typescript: {
				files: ['<config:typescript.src.src>', '<config:typescript.test.src>'],
				tasks: 'typescript'
			},
			less: {
				files: ['<config:less.dist.src>'],
				tasks: 'less'
			}
		},
		clean: {
			build: {
				src: [
					// server
					'app.js',
					'server/*.js',
					'server/*.d.ts',
					'server/*.js.map',
					// server test
					'server-test/*.js',
					'server-test/*.d.ts',
					'server-test/*.js.map',
					// client
					'client/css/style.css',
					'client/scripts/*.js',
					'client/scripts/*.d.ts',
					'client/scripts/*.js.map',
					// client test
					'client-test/*.js',
					'client-test/*.d.ts',
					'client-test/*.js.map'
				]
			}
		},
		jasmine_node: {
			projectRoot: "./server-test",
			requirejs: false,
			forceExit: true,
			jUnit: {
				report: true,
				savePath: "./server-test/reports/",
				useDotNotation: true,
				consolidate: true
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
	grunt.registerTask('default', ['clean', 'typescript', 'copy', 'less']);
	grunt.registerTask('test', ['clean', 'typescript', 'copy', 'karma', 'jasmine_node']);

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};