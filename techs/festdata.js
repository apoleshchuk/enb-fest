const merge = require("lodash.merge");
const fileEval = require("file-eval");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("festdata")
  .target("target", "?.festdata.json")
  .useSourceFilename("source", "?.festdata.js")
  .useFileList(["festdata.json", "festdata.js"])
  .builder(function(source, files) {
    return JSON.stringify(
      files
        .map(f => f.fullname)
        .concat(source)
        .reduce((json, file) => {
          const data = fileEval.sync(file);

          if (typeof data == "function") {
            return data(json);
          }

          return merge(json, data);
        }, {})
    );
  })
  .createTech();
