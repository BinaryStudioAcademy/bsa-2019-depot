const serverUrl = process.env.REACT_APP_SERVER_URL || window.location.origin;
const appUrl = process.env.CLIENT_HOST;
const rawServerUrl = process.env.REACT_APP_RAW_SERVER_URL;
const elasticHost = process.env.REACT_APP_ELASTIC_HOST;
const elasticPort = process.env.REACT_APP_ELASTIC_PORT;
const elasticIndex = process.env.REACT_APP_ELASTIC_INDEX;

export { serverUrl, appUrl, rawServerUrl, elasticHost, elasticPort, elasticIndex };
