# Depot

![TravisCI](https://api.travis-ci.org/BinaryStudioAcademy/bsa-2019-depot.svg?branch=develop)

Powerful tool for team work with code, based on GIT version control system.
![logo](https://user-images.githubusercontent.com/28801003/63500492-9eecb500-c4d2-11e9-9077-a7f398207217.png)

## About

### Git Server

Git server is like usual repository that used to save and retreat git data. The only difference is that git server saves all the files and changes in his own objects, not in folder. The best example of it is a GitHub repository.

- What I need to do to start GIT server on my local machine using console?

1. `cd .. && mkdir repositories/ && cd repositories/`
2. `mkdir initial-repo.git && cd initial-repo.git`
3. `git --bare init`

- What I need to do to start GIT server on my local machine using [nodegit](https://www.nodegit.org/)?

1. Set an env variable GIT_PATH = 'folder name where you want to store repositories'
2. Start node server and use post route `/repo` with body

```
{
   "user": "Jack", //name of user
   "name" : "FirstRepo" //name of repository
}
```

To populate git server with some data using a console, run `git clone 'path to folder'`, add some files, commit and push. Git server now has all the changes.

Example of using [nodegit](https://www.nodegit.org/):

```
NodeGit.Repository.open(pathToRepo).then(function (repo) {
  console.log("Opened repository", repo);
});
pathToRepo - path to git server you created.
repo - git server you just opened, which contains all information(files, branches, commits)
```

### Connection to Git via SSH

How it works:

1. We set up Node.js server on our EC2 instance.
2. When user sends us his pubic key, Node server appends it to the `.ssh/authorized_key` - file where SSH server of EC2 instance stores all public keys of users who can access it.
3. Return link with path to repository directory to user.
4. To pass authorization and connect to Git user has to store his private key at `~/.ssh/id_rsa` (or `C:\Users\MyUser\.ssh\id_rsa` for Windows) - default location where SSH would search private key.
5. User can access repo via `git@server.com:path/to/repo.git`
   For example:

```
git clone git@54.229.247.124:myproject.git
git clone git@depot.xyz:myproject.git
git remote add origin git@depot.xyz:myproject.git
```

More info:

[Info on managing users in EC2](https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/managing-users.html)

[Setting up Git server using SSH](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server)

[Guide on how to set up a Git server on EC2](https://www.freecodecamp.org/news/create-your-own-github-kinda-9b4581db675c/)

### Git Hooks

In order to keep our DB in sync with user interactions with remote Git repository we are using **"pre-receive"** and
**"update"** Git server-side hooks.

Hooks are being copied to to the `hooks` folder in your **bare** testing repository when it's being created.

One thing you should do is to set up `rabbitmqadmin` CLI tool which allows us to send messages to our 
RabbitMQ queue from the "update" Git hook:

1. You can download it by either:
    - Going to http://localhost:15672/cli/rabbitmqadmin which will trigger the download (if you've already installed RabbitMQ service).
    - Downloading raw file from [Github](https://raw.githubusercontent.com/rabbitmq/rabbitmq-management/v3.7.17/bin/rabbitmqadmin).
2. Next, depending on your OS, you should put it in:
    - a directory in PATH, e.g. /usr/local/bin, for **Linux**
    - anywhere you like, for **Windows**
3. This tool requires **Python** installed, so [download](https://www.python.org/downloads/) and install it if you haven't already.

_**Windows** users should uncomment the line 48 and comment down line 47 in the **"update"** hook 
(at `your-bare-repo.git/hooks` directory) and put the path to the `rabbitmqadmin` file inside 
the command._

Also you should be aware that in order to see changes from the website you should configure your Git client using the email
which corresponds to the account on the website, otherwise we won't be able to identify the user.

### RabbitMQ

- Install RabbitMQ: [Tutorial](https://www.rabbitmq.com/download.html)

- Run it:

**On Windows**. (starts after installation automatically, it running on localhost on standard port (5672))
You can stop/reinstall/start the RabbitMQ service from the Start Menu.

**On Debian and Ubuntu**. To start and stop the server, use the service tool. The service name is rabbitmq-server.
`sudo service rabbitmq-server stop`
`sudo service rabbitmq-server start`

### File Structure

As an example of project structure used [this repository](https://github.com/react-boilerplate/react-boilerplate/tree/master/app).

Directory purposes:

```
/components - any reusable components that are independent of business logic
/containers - modules that contain or are bound to business logic
/scenes - any container that has separate route
```

[Article: "Domain directory file structure"](https://tech.offgrid-electric.com/domain-directory-structure-for-react-apps-why-its-worth-trying-b3855ee77a1e?gi=be41e3fca7f3)

## Development process

### Environment

_/client/.env_

```
SKIP_PREFLIGHT_CHECK = true
PORT = 3001  # default. has to be changed if it is different
REACT_APP_SERVER_URL = "http://localhost:3000"  # default. has to be changed if it is different
REACT_APP_RAW_SERVER_URL = http://localhost:3003  # default. has to be changed if it is different
REACT_APP_STACK_OVERFLOW_API_KEY = "K)aMbXa)izv27xUSCXUW8A(("
REACT_APP_STACK_OVERFLOW_API_URL = "https://api.stackexchange.com/2.2/search"
REACT_APP_ELASTIC_HOST = https://search-xxxx-elastic-xxxxxxxxfqsenxxxsm.eu-central-1.es.amazonaws.com # need to be changed
REACT_APP_ELASTIC_PORT = 443 # default. has to be changed if it is different
REACT_APP_ELASTIC_INDEX = search-test # default. has to be changed if it is different
```

_/server/.env_

```
APP_PORT = 3000
CLIENT_HOST = http://localhost:3001

DB_NAME = depot # default. has to be changed to local DB name if it is different
DB_USERNAME = postgres # default. has to be changed to local PostgreSQL username if it is different
DB_PASSWORD = postgres # default. has to be changed to local PostgreSQL password if it is different
DB_HOST = localhost # default. has to be changed to local used host if it is different
DB_PORT = 5432 # default. has to be changed to local used port if it is different
DB_DIALECT = postgres # default. do not change

GOOGLE_CLIENT_ID = 97XXXXXXXX05-sgfxxxxxxxxxxxxxxxxxxxxxxxxxxxcmj0.apps.googleusercontent.com # has to be replaced with actual google client secret
GOOGLE_CLIENT_SECRET = ygyxxxXXXXxxxxxxxXXXXXxxxi # has to be replaced with actual google client secret
GOOGLE_CALLBACK_URL = http://localhost:3000/auth/google/callback # default. has to be changed to google callback uri if it is different
GOOGLE_SCOPE = https://www.googleapis.com/auth/userinfo.email # default. has to be changed to google scope if it is different

AWS_SES_ACCESS_KEY = AKIAWBOCxxxxxxx # has to be replaced with actual aws ses access key
AWS_SES_SECRET_KEY = EtKJdUrnWxxxxxxxxx # has to be replaced with actual aws ses secret key
AWS_SES_REGION = us-east-1 # has to be replaced with actual aws region
AWS_SES_SENDER = "Depotdepot.noreply@gmail.com" # default. has to be changed if it is different
AWS_S3_BUCKET = xxxx-depot # has to be replaced with actual aws s3 bucket

PUBLIC_KEY_PATH = /etc/ssh/ssh_host_rsa_key.pub # default for SSH server. Change to any public SSH key when running locally

RABBITMQ_CONNECTION_URL = amqp://localhost:5672 # default. has to be changed if it is different
EMAIL_QUEUE_NAME = emails # default. has to be changed if it is different
REPO_DATA_QUEUE_NAME = repo-data # default. has to be changed if it is different

SECRET_KEY = secretkey # has to be changed to own random secret key

GIT_PATH = '' # Has to be changed to path where you want to save repositories
SSH_KEYS = .ssh/authorized_keys # default path to 'authorized_keys' file to store SSH keys in

ELASTIC_HOST = https://search-xxxx-elastic-xxxxxxxxfqsenxxxsm.eu-central-1.es.amazonaws.com  # need to be changed
ELASTIC_PORT = 443 # default. has to be changed if it is different
ELASTIC_INDEX = search-test # default. has to be changed if it is different
```

_/raw-server/.env_

```
RAW_SERVER_PORT = 3003  # default. own preference might be used
SERVER_HOST = http://localhost:3000  # default. should be changed to the actual one
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

## Response format and error handling

All error and success notifications should be in this format:

```js
{ status: 401, message: 'Wrong password' }
```

Where status is a status code(200,401,404,500).
And message is a string we want to show user.

To make an error notification, do this:

```js
return Promise.reject({ status: 401, message: 'Wrong password' });
```

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
