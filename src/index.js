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

  /**
   * Check if the condition is if 
   */

  function isDirectiveIf(condition) {
    return (
      condition !== null &&
      condition.value !== null &&
      condition.type === directiveIf
    );
  }

  /**
   * Check if the node is an empty text node
   */

  function isEmptyTextNode(node) {
    return t.isJSXText(node) && node.value.trim() === "";
  }

  /**
   * Check if the node is a comment node
   */

  function isCommentExpressionContainer(node) {
    return (
      t.isJSXExpressionContainer(node) &&
      t.isJSXEmptyExpression(node.expression)
    );
  }

  /**
   * Check if the condition is elseif or else
   */

  function isDirectiveElseifOrElse(path) {
    let nextJSXElCondition;
    if (path.isJSXElement()) {
      nextJSXElCondition = getCondition(path.node);
      if (nextJSXElCondition.type !== directiveIf) {
        return true;
      }
    }
    return false;
  }

  return {
    visitor: {
      Program(path) {
        path.__conditionHelperImported = false;
      },
      /**
       * Process the JSXElement
       */
      JSXElement(path) {
        const { node, parentPath } = path;
        const condition = getCondition(node);
        if (isDirectiveIf(condition)) {
          // Every time an if is encountered, it is processed
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
            if (
              isEmptyTextNode(nextJSXElPath.node) ||
              isCommentExpressionContainer(nextJSXElPath.node)
            ) {
              // if the nextJSXElPath node is an empty text node or a comment node, keep looping
              continueSearch = true;
            } else if (isDirectiveElseifOrElse(nextJSXElPath)) {
              // if the condition type of nextJSXElPath node is elseif, add condition to conditions；otherwise defaults to true
              nextJSXElCondition = getCondition(nextJSXElPath.node);
              conditions.push({
                condition: nextJSXElCondition.type === directiveElseif
                  ? nextJSXElCondition.value
                  : t.booleanLiteral(true),
                jsxElement: nextJSXElPath.node,
              });
              nextJSXElPath.node.openingElement.attributes.splice(nextJSXElCondition.index, 1);
              nextJSXElPath.remove()
              // continue the loop when encountering elseif
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
          if (parentPath.isJSXElement()) {
            path.replaceWith(t.jsxExpressionContainer(callExp));
          } else {
            path.replaceWith(callExp);
          }

          const rootPath = path.findParent(p => p.isProgram());
          // help to generate code after escaping: import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
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
