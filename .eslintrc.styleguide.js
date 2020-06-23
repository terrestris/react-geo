module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": [
    "react",
    "markdown"
  ],
  "env": {
    "browser": true
  },
  "parser": "babel-eslint",
  "globals": {
    "Promise": false
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "no-console": "off",
    "semi": "off",
    "require-jsdoc": "off",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
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
    "space-infix-ops": ["error", { "int32Hint": false }]
  },
  "settings": {
    "react": {
      "version": "16.0"
    }
  }
};
