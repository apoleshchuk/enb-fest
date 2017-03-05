'use strict';

let path = require('path');
let fest = require('fest');

module.exports = require('enb/lib/build-flow').create()
	.name('festjs')
	.target('target', '?.fest.js')
	.defineOption('debug', false)
	.defineOption('extname', '.fest.js')
	.defineOption('beautify', true)
	.defineOption('cwd', process.cwd())
	.defineOption('templateName', function(target, extname) {
		return path.basename(target, extname);
	})
	.useSourceFilename('source', '?.fest.xml')
	.builder(function (filename) {
		var name = this._templateName(this._target, this._extname);
		var template = fest.compile(path.relative(this._cwd, filename), {
			debug: this._debug,
			beautify: this._beautify
		});

		return `
;(function () {
	var template = ${template};

	if (typeof define === 'function' && define.amd) {
		define(function () {
			return template;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = template;
	} else {
		if(!x.fest)x.fest={};
		x.fest['${name}']=template;
	}
}.call(this));`;
	})
	.createTech();
