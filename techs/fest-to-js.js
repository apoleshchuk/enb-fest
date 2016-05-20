'use strict';

let path = require('path');
let enb = require('enb');
let buildFlow = enb.buildFlow || require('enb/lib/build-flow');
let vfs = enb.asyncFS || require('enb/lib/fs/async-fs');
let _ = require('lodash');
let fest = require('fest');

module.exports = buildFlow.create()
    .name('festjs')
	.target('target', '?.fest.js')
    .defineOption('debug', false)
    .defineOption('beautify', true)
	.useSourceFilename('festxml', '?.fest.xml')
    .builder(function (xmlFilename) {
        var name = path.basename(this._target, '.js');
		var templatePath = path.relative(process.cwd(), xmlFilename);
		var pagePath = path.dirname(templatePath);
		var template = fest.compile(templatePath, {
			debug: this._debug,
            beautify: this._beautify
		});
		return `;(function(x){
			if(!x.fest)x.fest={};
			x.fest['${name}']=${template}
		})(Function('return this')());`;
	})
	.createTech();
