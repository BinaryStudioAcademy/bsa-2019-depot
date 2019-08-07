const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;
const scope = process.env.GOOGLE_SCOPE;

module.exports = {
  clientID,
  clientSecret,
  callbackURL,
  scope
};
