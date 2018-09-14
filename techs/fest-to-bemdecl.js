const BemCell = require("@bem/sdk.cell");
const bemDecl = require("@bem/sdk.decl");
const naming = require("@bem/sdk.naming.entity")("origin");
const { parse } = naming;

const TEMPLATE_NAME_RE = /fest:get name=["']([^"']+)"/gim;

module.exports = require("enb/lib/build-flow")
  .create()
  .name("fest-to-bemdecl")
  .target("target", "?.bemdecl.js")
  .useSourceText("source", "?.page.xml")
  .builder(function(content) {
    const decl = [];
    while (TEMPLATE_NAME_RE.exec(content) !== null) {
      const name = RegExp.$1;
      const entity = parse(name);

      if (!entity) {
        throw new Error(`Wrong bem block name ${match}
      				Use strict naming convention https://ru.bem.info/method/naming-convention/`);
      }

      decl.push(new BemCell({ entity: entity }));
    }

    return `exports = ${bemDecl.stringify(decl, { format: "v1" })}`;
  })
  .createTech();
