module.exports = function(node, files, targets, content) {
  return `
<fest:template xmlns:fest="http://fest.mail.ru" context_name="json">
<fest:script>
    json = json || {};
    json.CONSTANTS = json.CONSTANTS || {};
    json.CONSTANTS.TARGET = ${JSON.stringify(
      Object.keys(targets).reduce((dict, key) => {
        return {
          ...dict,
          [key]: { src: node.unmaskTargetName(targets[key]) }
        };
      }, {}),
      null,
      4
    )};
</fest:script>
${files.map(f => `<fest:include src="${node.relativePath(f)}"/>`).join("\n")}
${content || ""}
 </fest:template>
 `.trim();
};
