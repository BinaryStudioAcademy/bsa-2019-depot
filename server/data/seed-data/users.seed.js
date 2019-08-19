const cryptoHelper = require('../../helpers/crypto.helper');
const usersSeedUpdate = require('./user.seed.update.json');

const hash = password => cryptoHelper.encryptSync(password);

const now = new Date();

const usersSeed = [
  {
    email: 'test@test.com',
    username: 'test',
    password: hash('test1111')
  },
  {
    email: 'sandrk27@gmail.com',
    username: 'user0',
    password: hash('1234')
  },
  {
    email: 'user1@ukr.net',
    username: 'user1',
    password: hash('qwerty')
  },
  {
    email: 'user2@depot.com',
    username: 'user2',
    password: hash('2222')
  },
  {
    email: 'user3@gmail.com',
    username: 'user3',
    password: hash('3333')
  }
].map((user, ind) => ({
  ...user,
  ...usersSeedUpdate[ind],
  createdAt: now,
  updatedAt: now
}));

module.exports = usersSeed;
