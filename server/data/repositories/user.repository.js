// import BaseRepository from './base.repository';

class UserRepository /* extends BaseRepository */ {
  static getByEmail(email) {
    const user = {
      email,
      username: 'test_user',
      password: '1111',
      id: '001',
      name: 'Sasha'
    };
    return user;
  }

  static getByUsername(username) {
    const user = {
      email: 'test@test.com',
      username,
      password: '1111',
      id: '001',
      name: 'Sasha'
    };
    return user;
  }

  static getUserById(id) {
    const user = {
      email: 'test@test.com',
      username: 'test_user',
      password: '1111',
      id,
      name: 'Sasha'
    };
    return user;
  }
}

export default UserRepository;
