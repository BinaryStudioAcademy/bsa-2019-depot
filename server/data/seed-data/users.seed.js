const now = new Date();

const usersSeed = [
  {
    email: 'test@test.com',
    username: 'test',
    password: 'test'
  },
  {
    email: 'sandrk27@gmail.com',
    username: '',
    password: ''
  },
  {
    email: 'user1@ukr.net',
    username: 'user1',
    password: 'qwerty'
  },
  {
    email: 'user2@depot.com',
    username: 'user2',
    password: '2222'
  },
  {
    email: 'user3@gmail.com',
    username: 'user3',
    password: '3333'
  }
].map(user => ({
  ...user,
  createdAt: now,
  updatedAt: now
}));

module.exports = usersSeed;
