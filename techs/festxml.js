const { dirname, relative } = require("path");

module.exports = require("enb/lib/build-flow")
  .create()
  .name("festxml")
  .target("target", "?.fest.xml")
  .defineOption("requireNodeSources", {})
  .defineOption("constants", {})
  .dependOn("bemdecl", "?.bemdecl.js")
  .useSourceFilename("source", "?.page.xml")
  .useFileList("xml")
  .builder(function(source, files) {
    return this.node.requireNodeSources(this._requireNodeSources).then(() => {
      const dir = dirname(source);

      const sources = files
        .map(f => f.fullname)
        .concat(source)
        .map(file => `\t<fest:include src="${relative(dir, file)}"/>`);

      const constants = Object.keys(this._constants).reduce(
        (constants, key) => {
          const value = this._constants[key];
          return {
            ...constants,
            [key]: {
              src: value.startsWith("?")
                ? this.node.unmaskTargetName(value)
                : value
            }
          };
        },
        {}
      );
      return `
<fest:template xmlns:fest="http://fest.mail.ru" context_name="json">
    <fest:script>
        json = json || {};
        json.CONSTANTS = json.CONSTANTS || {};
        json.CONSTANTS.TARGET = ${JSON.stringify(constants, null, 4)};
    </fest:script>
${sources.join("\n")}
 </fest:template>
 `.trim();
    });
  })
  .createTech();
