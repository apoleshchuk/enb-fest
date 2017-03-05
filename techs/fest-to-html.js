'use strict';

module.exports = require('enb/lib/build-flow').create()
	.name('festhtml')
	.target('target', '?.html')
	.useSourceFilename('source', '?.fest.js')
	.useSourceFilename('json', '?.json')
	.builder(function (sourceFilename, jsonFilename) {
		// clean node cache
		delete require.cache[require.resolve(sourceFilename)];
		delete require.cache[require.resolve(jsonFilename)];

		let content = require(jsonFilename);
		if (typeof content == 'function') {
			content = content();
		}
		return require(sourceFilename)(content);
	})
	.createTech();
