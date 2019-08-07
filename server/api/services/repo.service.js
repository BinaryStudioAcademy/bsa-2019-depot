import NodeGit from 'nodegit';

const createRepo = async ({user, name}) => {
    let result = 'Repo was created';
    let pathToRepo = require("path").resolve(`../repositories/${user}/${name}`);
    await NodeGit.Repository.init(pathToRepo, 1).then(function (repo) {
    }).catch(function (reasonForFailure) {
        result = 'Error! Repos wasn`t created';
    });
    return result;
};

module.exports = { createRepo };