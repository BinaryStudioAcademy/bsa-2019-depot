const newman = require('newman');
const { DEV } = process.env;

newman.run(
  {
    collection: require('./test/api/DepotPostam.postman_collection.json'),
    globals: require('./test/api/GlobalEnvVar.postman_globals.json'),
    reporters: ['cli', 'json'],
    reporter: { json: { export: './test/api/output/jsonResults.json' } },
    delayRequest: 500,
    insecure: DEV || false
  },
  err => {
    if (err) {
      throw err;
    }
  }
);
