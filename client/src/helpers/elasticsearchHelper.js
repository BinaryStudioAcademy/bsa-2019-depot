import { Client } from 'elasticsearch';
import { elasticHost, elasticPort, elasticIndex as index } from '../app.config';

const client = new Client({
  host: elasticHost,
  port: elasticPort
});

export const addUser = async username =>
  client.index({
    index,
    body: {
      type: 'USER',
      username
    }
  });

export const addOrg = async orgname =>
  client.index({
    index,
    body: {
      type: 'ORG',
      username: orgname
    }
  });

export const addRepo = async (id, reponame, username) =>
  client.index({
    index,
    id,
    body: {
      type: 'REPO',
      reponame,
      username
    }
  });

export const updateRepo = async (id, reponame, username) =>
  client.update({
    index,
    id,
    body: {
      doc: {
        type: 'REPO',
        reponame,
        username
      }
    }
  });

export const deleteRepo = async id =>
  client.delete({
    index,
    id
  });
