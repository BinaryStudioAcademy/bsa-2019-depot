/* eslint-disable camelcase */
import OAuthManager from 'react-native-oauth';
import {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPE,
  GOOGLE_API
} from 'react-native-dotenv';

const callback_url = GOOGLE_CALLBACK_URL;
const client_id = GOOGLE_CLIENT_ID;
const client_secret = GOOGLE_CLIENT_SECRET;
const scope = GOOGLE_SCOPE;
const google_api = GOOGLE_API;

const manager = new OAuthManager('mobile');
manager.configure({
  google: {
    callback_url,
    client_id,
    client_secret
  }
});

const GoogleManager = manager;

export { callback_url, client_id, client_secret, scope, google_api, GoogleManager };
