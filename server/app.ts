///<reference path='libs/typing/node/node.d.ts' />
///<reference path='libs/typing/express/express.d.ts' />

import express = require("express");
import http = require("http");
import path = require("path");

var app = express();

// all environments
app.set("port", process.env.PORT || 8888);
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "client")));

// development only
if ("development" === <any>app.get("env")) {
	app.use(express.errorHandler());
}

app.get("/api/sample", (req, resp) => {
	resp.contentType("application/json");

	resp.json({
		greeting: "Hello TypeScript!"
	});
});

http.createServer(app).listen(app.get("port"), () => {
	console.log("Express server listening on port " + app.get("port"));
});
