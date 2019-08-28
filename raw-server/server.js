require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.RAW_SERVER_PORT || 3002;
const serverHost = process.env.SERVER_HOST;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/:owner/:reponame/:branch/:path([^/]*)', (req, res) => {
  const {
    owner, reponame, branch, path
  } = req.params;
  const { token } = req.query;

  const wrapContent = (content) => {
    const escapedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre style="word-wrap: break-word; white-space: pre-wrap;">${escapedContent}</pre>`;
  };

  const queryParams = {
    params: {
      owner,
      reponame,
      branch,
      path,
      token
    }
  };
  axios
    .get(`${serverHost}/api/files`, queryParams)
    .then(({ data }) => res.send(wrapContent(data)))
    .catch(({ response: { status } }) => {
      if (status === 404) {
        res.send(wrapContent('404: Not Found'));
      } else if (status === 401) {
        res.send(wrapContent('401: Access denied'));
      }
    });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}!`);
});
