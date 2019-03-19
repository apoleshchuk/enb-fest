const buildTemplate = require("../utils/build-template.js");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("fest-template")
  .target("target", "?.fest-template.xml")
  .defineOption("targets", {})
  .dependOn("deps", "?.deps.js")
  .useFileList("xml")
  .builder(function(files) {
    const node = this.node;
    return buildTemplate(
      node,
      files.map(f => f.fullname),
      this._targets,
      '<fest:if test="json.FEST_TEMPLATE_NAME"><fest:get select="json.FEST_TEMPLATE_NAME">json</fest:get></fest:if>'
    );
  })
  .createTech();
