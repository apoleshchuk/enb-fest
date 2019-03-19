const { relative } = require("path");
const buildTemplate = require("../utils/build-template.js");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("fest-page")
  .target("target", "?.fest-page.xml")
  .defineOption("requiredSources", [])
  .defineOption("targets", {})
  .dependOn("deps", "?.deps.js")
  .useSourceFilename("source", "?.page.xml")
  .useFileList("xml")
  .builder(function(source, files) {
    const node = this.node;

    return Promise.resolve()
      .then(() => {
        if (!this._requiredSources.length) {
          return true;
        }
        return node.requireSources(
          this._requiredSources.map(n => node.unmaskTargetName(n))
        );
      })
      .then(() => {
        return buildTemplate(
          node,
          files.map(f => f.fullname).concat(source),
          this._targets
        );
      });
  })
  .createTech();
