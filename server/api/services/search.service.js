const { Client } = require('elasticsearch');

const { elasticHost, elasticPort, elasticIndex } = require('../../config/elastic.config');

const client = new Client({
  host: elasticHost,
  port: elasticPort
});

const find = async (user, repo) => {
  const query = `${user}${repo ? ` AND ${repo}` : ''}`;
  const results = await client.search({
    index: elasticIndex,
    size: 5,
    body: {
      query: {
        query_string: {
          query,
          type: 'phrase_prefix',
          fields: ['username', 'reponame']
        }
      }
    }
  });
  return results.hits.hits.map(({ _source: { username, reponame, type } }) => ({
    username,
    reponame,
    type
  }));
};

module.exports = {
  find
};
