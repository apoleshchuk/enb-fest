'use strict';

let path = require('path');
let _ = require('lodash');

module.exports = require('enb/lib/build-flow').create()
    .name('festdata')
	.target('target', '?.festdata.json')
	.useSourceFilename('source', '?.festdata.js')
	.useFileList(['festdata.json', 'festdata.js'])
    .builder(function (source, files) {
        return JSON.stringify(files.concat({
            fullname: source
        }).reduce(function(json, file) {
            let data = require(file.fullname);

            if (typeof data == 'function') {
                json = data(json);
            } else {
                json = _.merge(json, data);
            }

            return json;
        }, {}));
	})
	.createTech();
