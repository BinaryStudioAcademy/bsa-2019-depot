### Before running API tests on localhost<br/>

Change Postman variables in `GlobalEnvVar.postman_globals.json`.
Value `depotApi` to localhost, and if you want to use your account then change `loginEmail`, `loginPass` accrodingly.

Use env variable `DEV=true` before `npm run test:api` which disables SSL verification checks and allows self-signed SSL certificates.

### How to run tests

```sh
$ cd client
$ npm run test:api
```
