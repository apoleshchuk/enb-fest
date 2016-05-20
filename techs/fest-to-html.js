'use strict';

let path = require('path');
let enb = require('enb');
let buildFlow = enb.buildFlow || require('enb/lib/build-flow');
let vfs = enb.asyncFS || require('enb/lib/fs/async-fs');
let _ = require('lodash');
let fest = require('fest');

module.exports = buildFlow.create()
    .name('festhtml')
	.target('target', '?.html')
    .defineOption('debug', false)
    .defineOption('beautify', true)
	.useSourceFilename('festxml', '?.fest.xml')
	.useSourceText('festjson', '?.fest.json')
	.useFileList('fest.json')
    .builder(function (xmlFilename, json, files) {
        json = files.reduce(function(json, file) {
            return _.defaultsDeep(json, require(file.fullname));
        }, JSON.parse(json));

        return fest.render(xmlFilename, json, {
            beautify: this._beautify,
            debug: this._debug
        });
	})
	.createTech();
