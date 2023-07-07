const directiveIf = 'x-if';
const directiveElseif = 'x-elseif';
const directiveElse = 'x-else';
const helperImportedFrom = 'babel-runtime-jsx-plus'
const helperImportedName = 'createCondition'
const helperLocalName = '__create_condition__';

export default function({ types: t }) {
  /**
   * Get condition type, enum of {if|elseif|else|null}
   */
  function getCondition(jsxElement) {
    if (t.isJSXOpeningElement(jsxElement.openingElement)) {
      const { attributes } = jsxElement.openingElement;
      for (let i = 0, l = attributes.length; i < l; i++) {
        if (t.isJSXAttribute(attributes[i])) {
          switch (attributes[i].name.name) {
            case directiveIf:
            case directiveElseif:
            case directiveElse:
              return {
                type: attributes[i].name.name,
                value: t.isJSXExpressionContainer(attributes[i].value)
                  ? attributes[i].value.expression
                  : attributes[i].value,
                index: i,
              };
          }
        }
      }
    }
    return null;
  }

  return {
    visitor: {
      Program(path) {
        path.__conditionHelperImported = false;
      },
      JSXElement(path) {
        const { node, parentPath } = path;
        const condition = getCondition(node);
        if (condition !== null && condition.value !== null && condition.type === directiveIf) {
          const { type, value, index } = condition;
          const conditions = [];

          node.openingElement.attributes.splice(index, 1);
          conditions.push({
            condition: value,
            jsxElement: node,
          });

          let continueSearch = false;
          let nextJSXElPath = path;
          let nextJSXElCondition;
          do {
            nextJSXElPath = nextJSXElPath.getSibling(nextJSXElPath.key + 1);
            if (nextJSXElPath.isJSXText() && nextJSXElPath.node.value.trim() === '') {
              continueSearch = true;
            } else if (nextJSXElPath.isJSXElement() &&
            (nextJSXElCondition = getCondition(nextJSXElPath.node)) &&
            nextJSXElCondition.type !== directiveIf
            ) {
              conditions.push({
                condition: nextJSXElCondition.type === directiveElseif
                  ? nextJSXElCondition.value
                  : t.booleanLiteral(true),
                jsxElement: nextJSXElPath.node,
              });
              nextJSXElPath.node.openingElement.attributes.splice(nextJSXElCondition.index, 1);
              nextJSXElPath.remove()
              continueSearch = nextJSXElCondition.type === directiveElseif;
            } else {
              continueSearch = false;
            }
          } while (continueSearch);

          const arrayExp = t.arrayExpression(conditions.map(({ condition, jsxElement }) => {
            const elements = [
              t.arrowFunctionExpression([], condition),
              t.arrowFunctionExpression([], jsxElement),
            ];
            return t.arrayExpression(elements);
          }));

          const callExp = t.callExpression(t.identifier(helperLocalName), [arrayExp]);
          // <></>类型为JSXFragment 但是Fragment还是JSXElement
          if (parentPath.isJSXElement() || parentPath.type === 'JSXFragment') {
            path.replaceWith(t.jsxExpressionContainer(callExp));
          } else {
            path.replaceWith(callExp);
          }

          const rootPath = path.findParent(p => p.isProgram());
          if (rootPath.__conditionHelperImported === false) {
            const imported = t.identifier(helperImportedName);
            const local = t.identifier(helperLocalName);
            const importDeclaration = t.importDeclaration([
              t.importSpecifier(local, imported)
            ], t.stringLiteral(helperImportedFrom))
            rootPath.unshiftContainer('body', importDeclaration);
            rootPath.__conditionHelperImported = true;
          }
        }
      }
    },
  };
}
