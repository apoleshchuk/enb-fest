const { relative } = require("path");
const buildTemplate = require("../utils/build-template.js");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("fest-page")
  .target("target", "?.fest-page.xml")
  .dependOn("deps", "?.deps.js")
  .defineOption("requiredSources", [])
  .defineOption("targets", {})
  .useSourceFilename("source", "?.page.xml")
  .useFileList("xml")
  .builder(function(source, files) {
    return buildTemplate.call(this, files.map(f => f.fullname).concat(source));
  })
  .createTech();
