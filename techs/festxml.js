'use strict';

let path = require('path');
let enb = require('enb');
let buildFlow = enb.buildFlow || require('enb/lib/build-flow');

module.exports = buildFlow.create()
    .name('festxml')
	.target('target', '?.fest.xml')
    .dependOn('bemdecl', '?.bemdecl.js')
	.useSourceFilename('page', '?.page.xml')
	.useFileList('xml')
    .builder(function (page, files) {
        let dirname = path.dirname(page);
        let sources = files.concat({fullname: page}).map(function(file) {
            let relative = path.relative(dirname, file.fullname);
            return `\t<fest:include src="${relative}"/>`;
        }).join('\n');
        return `<fest:template xmlns:fest="http://fest.mail.ru" context_name="json">\n${sources}\n</fest:template>`;
	})
	.createTech();
