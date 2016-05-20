'use strict';

let inherit = require('inherit');
let enb = require('enb');
let vfs = enb.asyncFS || require('enb/lib/fs/async-fs');
let requireOrEval = require('enb-require-or-eval');
let asyncRequire = require('enb-async-require');
let clearRequire = require('clear-require');
let deps = require('enb-bem-techs/lib/deps/deps');
let bemNaming = require('bem-naming');

module.exports = inherit(enb.BaseTech, {
    getName: function () {
        return 'fest-to-bemdecl';
    },

    configure: function () {
        this._target = this.getOption('target', '?.bemdecl.js');
        this._target = this.node.unmaskTargetName(this._target);

        this._sourceTarget = this.getOption('source', '?.page.xml');
        this._sourceTarget = this.node.unmaskTargetName(this._sourceTarget);

        this._bemdeclFormat = this.getOption('bemdeclFormat', 'deps');
    },

    getTargets: function () {
        return [this._target];
    },

    build: function () {
        var node = this.node,
            target = this._target,
            cache = node.getNodeCache(target),
            bemdeclFilename = node.resolvePath(target),
            pagexmlFilename = node.resolvePath(this._sourceTarget),
            bemdeclFormat = this._bemdeclFormat;

        return this.node.requireSources([this._sourceTarget])
            .then(function () {
                if (cache.needRebuildFile('bemdecl-file', bemdeclFilename) ||
                    cache.needRebuildFile('pagexml-file', pagexmlFilename)
                ) {
                    return vfs.read(pagexmlFilename, 'utf-8')
                        .then(function (pagexml) {
                            var pagexmlDeps = getDepsFromPagexml(pagexml);
                            var decl,
                                data,
                                str;

                            if (bemdeclFormat === 'deps') {
                                decl = pagexmlDeps;
                                data = { deps: decl };
                                str = `exports.deps = ${JSON.stringify(decl, null, 4)};\n`;
                            } else {
                                decl = deps.toBemdecl(pagexmlDeps),
                                data = { blocks: decl };
                                str = `exports.blocks = ${JSON.stringify(decl, null, 4)};\n`;
                            }

                            return vfs.write(bemdeclFilename, str, 'utf-8')
                                .then(function () {
                                    cache.cacheFileInfo('bemdecl-file', bemdeclFilename);
                                    cache.cacheFileInfo('pagexml-file', pagexmlFilename);
                                    node.resolveTarget(target, data);
                                });
                        });
                } else {
                    node.isValidTarget(target);
                    clearRequire(bemdeclFilename);

                    return asyncRequire(bemdeclFilename)
                        .then(function (result) {
                            node.resolveTarget(target, result);
                            return null;
                        });
                }
            });
    }
});

function getDepsFromPagexml(pagexml) {
    var deps = [], depsIndex = {};

    pagexml.match(/fest:get name="([^"]+)"/gim).map(function(match) {
        return /name="([^"]+)"/i.exec(match)[1];
    }).map(function(name) {
		var dep, parsed, itemKey, subItemKey;

		if ((parsed = bemNaming.parse(name))) {
			dep = {block: parsed.block};

			if (parsed.elem) {
				dep.elem = parsed.elem;
			}

            itemKey = depKey(dep);
            if (!depsIndex[itemKey]) {
                deps.push(dep);
                depsIndex[itemKey] = true;
            }

			if (parsed.modName) {
				dep.mod = parsed.modName;

				if (typeof parsed.modVal == 'string' && parsed.modVal) {
					dep.val = parsed.modVal;
				}

                subItemKey = depKey(dep);
                if (!depsIndex[subItemKey]) {
                    deps.push(dep);
                    depsIndex[subItemKey] = true;
                }
			}
		} else {
			throw new Error(`Wrong bem block name ${match}
            Use strict naming convention https://ru.bem.info/method/naming-convention/`);
		}
    });

    return deps;
}

function depKey(dep) {
    return dep.block +
        (dep.elem ? '__' + dep.elem : '') +
        (dep.mod ? '_' + dep.mod + (dep.val ? '_' + dep.val : '') : '');
}
