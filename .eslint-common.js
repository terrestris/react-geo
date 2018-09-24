module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": [
    "html",
    "react",
    "markdown"
  ],
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "globals": {
    "Promise": false
  },
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "semi": ["error", "always"],
    "one-var": ["error", "never"],
    "no-confusing-arrow": "error",
    "no-unused-vars": ["error", {
      "ignoreRestSiblings": true
    }],
    "key-spacing": ["error", {
      "beforeColon": false,
      "afterColon": true
    }],
    "react/jsx-tag-spacing": ["error", {
      "beforeSelfClosing": "always"
    }],
    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true
      }
    }],
    "space-infix-ops": ["error", {"int32Hint": false}]
  },
  "settings": {
    "react": {
      "version": "16.0"
    }
  }
};
