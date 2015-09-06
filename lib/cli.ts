"use strict";

import * as lib from "./index";

import * as fs from "fs";
let packageJson = JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8"));
import * as commandpost from "commandpost";

interface RootOpts {
	word: string[];
}

let root = commandpost
	.create<RootOpts, {}>("tssample")
	.version(packageJson.version, "-v, --version")
	.option("--word <word>", "hi! <word>")
	.action((opts, args) => {
		process.stdout.write(lib.hi(opts.word[0]) + "\n");
		process.exit(0);
	});

commandpost.exec(root, process.argv);
