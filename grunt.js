module.exports = function (grunt) {
	grunt.initConfig({
		typescript:{
			client:{ // --declarations --sourcemap --target ES5 --out client/scripts/main.js client/scripts/main.ts
				src:['client/scripts/main.ts'],
				dest:'client/scripts/main.js',
				options:{
					target:'es5',
					sourcemap:true,
					declaration_file:true
				}
			},
			client_test:{
				src:['client-test/main-spec.ts'],
				options:{
					target:'es5',
					sourcemap:true,
					declaration_file:true
				}
			},
			server:{ // --target ES5 --module Node server/app.ts
				src:['server/app.ts'],
				options:{
					target:'es5',
					module:'Node',
					sourcemap:true,
					declaration_file:true
				}
			},
			server_test:{
				src:['server-test/api-spec.ts'],
				dest:'server-test/api-spec.js',
				options:{
					target:'es5',
					module:'Node',
					sourcemap:true,
					declaration_file:true
				}
			}
		},
		copy:{
			dist:{
				files:{
					"app.js":"server/app.js"
				}
			}
		},
		less:{
			development:{
				options:{
					paths:['client/css']
				},
				files:{
					'client/css/style.css':'client/css/**/*.less'
				}
			}
		},
		watch:{
			typescript:{
				files:['<config:typescript.src.src>', '<config:typescript.test.src>'],
				tasks:'typescript'
			},
			less:{
				files:['<config:less.dist.src>'],
				tasks:'less'
			}
		},
		clean:{
			src:[
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
		},
		jasmine:{
			src: 'client/scripts/**/*.js',
			specs: 'client-test/*-spec.js',
			helper: 'client-test/libs/**/*.js',
			timeout: 10000,
			junit: {
				output: 'client-test/reports/'
			},
			phantomjs:{
				'ignore-ssl-errors' : true
			}
		},
		jasmine_node:{
			projectRoot:"./server-test",
			requirejs:false,
			forceExit:true,
			jUnit:{
				report:true,
				savePath:"./server-test/reports/",
				useDotNotation:true,
				consolidate:true
			}
		}
	});
	grunt.registerTask('default', 'clean typescript copy less');
	grunt.registerTask('test', 'clean typescript copy jasmine jasmine_node');

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-jasmine-runner');
	grunt.loadNpmTasks('grunt-jasmine-node');
};