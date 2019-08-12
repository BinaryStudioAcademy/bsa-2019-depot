const jwtMiddleware = require('./jwt.middleware');

/* eslint-disable max-len */
module.exports = (routesWhiteList = []) => (req, res, next) => (routesWhiteList.some(route => route === req.path) ? next() : jwtMiddleware(req, res, next)); // auth the user if requested path isn't from the white list
/* eslint-enable max-len */
