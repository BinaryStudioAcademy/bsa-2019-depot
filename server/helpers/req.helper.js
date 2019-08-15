const { argv } = require('yargs');

const getReqUrl = req => (argv.env === 'dev' ? process.env.CLIENT_HOST : `${req.protocol}://${req.get('host')}`);

module.exports = { getReqUrl };
