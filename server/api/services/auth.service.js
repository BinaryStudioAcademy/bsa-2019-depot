import UserRepository from '../../data/repositories/user.repository';

export const login = async ({ id }) => ({
  user: await UserRepository.getUserById(id)
});

export const register = async (userData) => {
  const newUser = await UserRepository.addUser({
    ...userData
  });
  return login(newUser);
};
