// const BaseRepository = require('./base.repository');

let users = [
  {
    email: 'test@test.com',
    username: 'test_user',
    password: '1111',
    id: '001',
    name: 'Sasha'
  },
  {
    email: 'vboiko0@gmail.com',
    username: 'vboiko0',
    password: '1111',
    id: '003',
    name: 'Vasyl Boyko'
  },
  {
    email: 'sandrk27@gmail.com',
    username: 'sandrk',
    password: '1111',
    id: '004',
    name: 'Sasha2'
  }
];

class UserRepository /* extends BaseRepository */ {
  static addUser({ ...userData }) {
    const newUser = {
      id: Date.now(),
      username: '',
      password: '',
      name: '',
      ...userData
    };
    users.push(newUser);
    return newUser;
  }

  static setUsernameById(id, username) {
    users = users.map((user) => {
      if (+user.id === +id) {
        const updatedUser = {
          ...user,
          username
        };
        return updatedUser;
      }
      return user;
    });

    return true;
  }

  static getByEmail(email) {
    const user = users.find(user1 => user1.email === email);
    if (user) return user;
    return null;
  }

  static getByUsername(username) {
    const user = users.find(user1 => user1.username === username);
    if (user) return user;
    return null;
  }

  static getUserById(id) {
    const user = users.find(user1 => +user1.id === +id);
    if (user) return user;
    return null;
  }
}

module.exports = UserRepository;
