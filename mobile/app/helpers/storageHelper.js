import AsyncStorage from '@react-native-community/async-storage';

const set = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const get = async key => await AsyncStorage.getItem(key);

const clear = async () => {
  await AsyncStorage.clear();
};

export default {
  set,
  get,
  clear
};
