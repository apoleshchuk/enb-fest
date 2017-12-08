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
    .defineOption('requireNodeSources', {})
    .defineOption('constants', {})
    .builder(function (page, files) {
        return this.node.requireNodeSources(this._requireNodeSources)
            .then(() => {
                let dirname = path.dirname(page);
                let sources = files.concat({fullname: page}).map(function(file) {
                    let relative = path.relative(dirname, file.fullname);
                    return `\t<fest:include src="${relative}"/>`;
                }).join('\n');
                let constants = Object.keys(this._constants).reduce((constants, key) => {
                    let value = this._constants[key];
                    if (value.charAt(0) === '?') {
                        value = this.node.unmaskTargetName(value);
                    }
                    return {
                        ...constants,
                        [key]: {
                            src: value
                        }
                    }
                }, {});
                constants = `<fest:script>(json.CONSTANTS = (json.CONSTANTS || {})).TARGET = ${JSON.stringify(constants, null, 4)};</fest:script>`;
                return `<fest:template xmlns:fest="http://fest.mail.ru" context_name="json">\n${constants}\n${sources}\n</fest:template>`;
            });
	})
	.createTech();
