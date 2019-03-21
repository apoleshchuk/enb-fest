module.exports = function(files = [], content = "") {
  const { _targets = {}, _requiredSources = [], node } = this;

  return node
    .requireSources(_requiredSources.map(n => node.unmaskTargetName(n)))
    .then(() => {
      return `
<fest:template xmlns:fest="http://fest.mail.ru" context_name="json">
<fest:script>
    json = json || {};
    json.CONSTANTS = json.CONSTANTS || {};
    json.CONSTANTS.TARGET = ${JSON.stringify(
      Object.keys(_targets).reduce((dict, key) => {
        return {
          ...dict,
          [key]: { src: node.unmaskTargetName(_targets[key]) }
        };
      }, {}),
      null,
      4
    )};
</fest:script>
${files.map(f => `<fest:include src="${node.relativePath(f)}"/>`).join("\n")}
${content}
</fest:template>`.trim();
    });
};
