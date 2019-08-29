const serverUrl = process.env.REACT_APP_SERVER_URL || window.location.origin;
const appUrl = process.env.CLIENT_HOST;
const rawServerUrl = process.env.REACT_APP_RAW_SERVER_URL;

export { serverUrl, appUrl, rawServerUrl };
