const { relative } = require("path");
const fest = require("fest");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("festjs")
  .target("target", "?.fest.js")
  .defineOption("debug", false)
  .defineOption("beautify", true)
  .defineOption("cwd", process.cwd())
  .defineOption("template", function(content, file) {
    return "module.exports = " + content;
  })
  .useSourceFilename("source", "?.fest.xml")
  .builder(function(file) {
    const content = fest.compile(relative(this._cwd, file), {
      debug: this._debug,
      beautify: this._beautify
    });
    return this._template(content, file);
  })
  .createTech();
