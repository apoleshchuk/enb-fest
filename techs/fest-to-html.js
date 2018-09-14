const fileEval = require("file-eval");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("festhtml")
  .target("target", "?.html")
  .useSourceFilename("source", "?.fest.js")
  .useSourceFilename("json", "?.json")
  .builder(function(template, data) {
    let content = fileEval.sync(data);
    if (typeof content == "function") {
      content = content();
    }

    return fileEval.sync(template)(content);
  })
  .createTech();
