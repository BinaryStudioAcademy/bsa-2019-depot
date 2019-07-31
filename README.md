# Depot

## Code linting and formatting

For good team coding experience we are using two tools [eslint](https://www.npmjs.com/package/eslint) and [prettier](https://www.npmjs.com/package/prettier). They are checking created/modified code on `git commit` command by [husky](https://www.npmjs.com/package/husky) + [lint-staged](https://www.npmjs.com/package/lint-staged).

### Code formatting rules for 'prettier'

```js
{
  "tabWidth": 2, // set 2 spaces indentation
  "printWidth": 120, // set max length of line
  "singleQuote": true, // allow only single quotes
  "trailingComma": "none", // remove trailing comma
  "semi": true // set semicolons at the end of line
}
```
Code will be formatted automatically before commit, so each member can write code as they like without any doubts.

### Code linting rules for 'eslint'

_Global:_
```js
{
	"camelcase": 2,
	"no-unused-vars": 2, // disallow unused variables
	"eqeqeq": 2, // allow only strict equality operator '===' 
	"no-console": [2, { "allow": ["warn", "error"] }], // disallow using console.log
	"indent": 2, // allow 2 spaces indentation
	"quotes": [2, "single", "avoid-escape"], // allow single quotes only
	"semi": 2 // disallow line end without semi comma
}
```

_Frontend specific:_
```js
{
  "react/display-name": 2, // disallow defining react components without name
  "react/no-unescaped-entities": 0, // allow using unescaped UTF symbols in JSX markup
  "react/prop-types": 2, // disallow not define PropTypes for react components
  "react/jsx-no-bind": 2 // disallow using lambda functions in JSX markup
}
```

Eslint will try to fix all mistakes automatically before commit, but some problems should be fixed manually. For example _"quotes", "indent", "semi"_ fixing automatically, but all other require a developer attention.