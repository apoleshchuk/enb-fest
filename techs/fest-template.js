const buildTemplate = require("../utils/build-template.js");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("fest-template")
  .target("target", "?.fest-template.xml")
  .defineOption("targets", {})
  .useFileList("xml")
  .builder(function(files) {
    return buildTemplate.call(
      this,
      files.map(f => f.fullname),
      '<fest:if test="json.FEST_TEMPLATE_NAME"><fest:get select="json.FEST_TEMPLATE_NAME">json</fest:get></fest:if>'
    );
  })
  .createTech();
