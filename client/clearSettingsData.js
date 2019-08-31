const fetch = require('node-fetch');
{
  const url = 'https://stage.depothub.xyz/api';
  const args = require('./test/specs/credentials');

  class ClearValue {
    static async sendLoginUserRequest(url, args) {
      return fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: args.login.email,
          password: args.login.password
        })
      });
    }
    static async getUserId(url, token) {
      return fetch(`${url}/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.token}`
        }
      });
    }

    static async sendUserSettingsData(url, token, userId) {
      return fetch(`${url}/users`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId.id,
          settings: {
            bio: '',
            company: '',
            location: '',
            name: '',
            url: ''
          }
        })
      });
    }
  }

  async function ChangeSettings(url, args) {
    const responseLoginData = await ClearValue.sendLoginUserRequest(url, args);
    if (responseLoginData.status === 200) {
      const token = await responseLoginData.json();
      const responseUserData = await ClearValue.getUserId(url, token);
      const userId = await responseUserData.json();
      await ClearValue.sendUserSettingsData(url, token, userId);
      return Promise.resolve();
    }

    const responseJSON = await responseLoginData.json();
    const error = new Error(`Failed to change user settings ${url}`);
    error.message = '' + JSON.stringify(responseJSON.message);
    return Promise.reject(error);
  }

  function handleError(error) {
    // const errorBody = () => {
    //   return error && error.message ? error.message : error;
    // };
    // console.log('Error during script', errorBody());
    process.exit(1);
  }

  module.exports = async done => {
    ChangeSettings(url, args)
      .then(() => {})
      .catch(error => {
        done(handleError(error));
      });
  };
}
