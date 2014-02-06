///<reference path='libs/express-3.0.d.ts' />

import express = module("express");
import http = module("http");
import path = module("path");

var app:express.ServerApplication = (<any>express)();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.use((<any>express).cookieParser());
	app.use(express.bodyParser({
		keepExtensions: true,
		uploadDir: './tmp'
	}));
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use((<any>express).session({ secret: 'vv' }));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'client')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

export var handler = (req:express.ServerRequest, resp:express.ServerResponse) => {
	resp.contentType('application/json');

	resp.json({
		greeting: "Hello TypeScript!"
	});
};

app.get('/api/sample', handler);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
