# Depot

## Development process

### Environment

_/client/.env_
```
SKIP_PREFLIGHT_CHECK=true
PORT=3001
```

_/server/.env_
```
APP_PORT = 3000

DB_NAME = depot # default. has to be changed to local DB name if it is different
DB_USERNAME = postgres # default. has to be changed to local PostgreSQL username if it is different
DB_PASSWORD = postgres # default. has to be changed to local PostgreSQL password if it is different
DB_HOST = localhost # default. has to be changed to local used host if it is different
DB_PORT = 5432 # default. has to be changed to local used port if it is different
DB_DIALECT = postgres # default. do not change
```

### Branches

In this project we follow with [Pull Request process](https://help.github.com/en/articles/about-pull-requests). Two main branches are protected with a [Github branch protection rules](https://help.github.com/en/articles/defining-the-mergeability-of-pull-requests):

- `master`: Require pull request with 3 reviews before merging
- `develop`: Require pull request with 2 review before merging

Normal flow is to create new branch for each task or group of linked tasks. Name of branch **must** have next structure:

`<prefix>/<problem-name>`

Allowed prefixes: `new/`, `patch/`, `fix/`.  
Problem name it's a text summary of problem or ticket id.

Examples:  
- `fix/user-profile-avatar`
- `fix/#543`
- `patch/button-styles`

After task is completed ― create PR of your branch into `develop` and assign two other developers to review. Fell free to assign one _student_ and one _coach_ or just two _students_.

Reviewer can request changes, and you have two options:
1. Agree with reviewer and fix
2. Explain your point of view, if you disagree

As result PR should be approved by all reviewers and then owner of Pull Request should merge it.

Merge to `master` is going on regular basis and only from `develop` and require 3 reviewers with one coach as minimum.


`fix/user-profile-avatar` _--PR-->_ `develop` _--PR-->_ `master`


### Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. There is a built-in commit linter. Basic rules:

- Commit messages must be prefixed with the name of the changed subsystem, followed by a colon and a space and start with an imperative verb.
  Supported subsystems:
  > build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test

- Commit messages **must** start with a capital letter
- Commit messages **must not** end with a dot

Example:  
`fix: Add error handling` 👍  
~~`fixed error handling.`~~ 👎


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
