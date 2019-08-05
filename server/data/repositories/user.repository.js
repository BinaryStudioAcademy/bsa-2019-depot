// import BaseRepository from './base.repository';

const users = [
  {
    email: 'test@test.com',
    username: 'test_user',
    password: '1111',
    id: '001',
    name: 'Sasha'
  }
];

class UserRepository /* extends BaseRepository */ {
  static addUser({ ...userData }) {
    const newUser = {
      ...userData,
      id: '002',
      name: 'Ivan'
    };
    users.push(newUser);
    return newUser;
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
    const user = users.find(user1 => user1.id === id);
    if (user) return user;
    return null;
  }
}

export default UserRepository;
