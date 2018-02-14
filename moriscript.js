module.exports = function(babel) {
  let t = babel.types;
  
  function moriMethod(name) {
    const expr = t.memberExpression(
      t.identifier("mori"),
      t.identifier(name)
    );
    expr.isClean = true;
    return expr;
  }

  return {
    visitor: {
      ArrayExpression: function(path) {
        path.replaceWith(
          t.callExpression(
            t.identifier("vector"),
            path.node.elements
          )
        );
      },

      ObjectExpression: function(path) {
        const props = [];

        path.node.properties.forEach(prop => {
          props.push(
            t.stringLiteral(prop.key.name),
            prop.value
          );
        });

        path.replaceWith(
          t.callExpression(
            t.identifier("hashMap"),
            props
          )
        );
      },

      AssignmentExpression: function(path) {
        let lhs = path.node.left;
        const rhs = path.node.right;

        if (t.isMemberExpression(lhs)) {
          if (t.isIdentifier(lhs.property)) {
            lhs.property = t.stringLiteral(lhs.property.name);
          }

          path.replaceWith(
            t.callExpression(
              moriMethod("assoc"),
              [lhs.object, lhs.property, rhs]
            )
          );
        }
      },
      
      MemberExpression: function(path) {
        if (path.node.isClean) return;
        if (t.isAssignmentExpression(path.parent)) return;
        
        if (t.isIdentifier(path.node.property)) {
          path.node.property = t.stringLiteral(path.node.property.name);
        }
        
        path.replaceWith(
          t.callExpression(
            moriMethod("get"),
            [path.node.object, path.node.property]
          )
        )
      }
    }
  };
}
