import io from 'socket.io-client';

export const socketInit = namespace => {
  const { REACT_APP_SERVER_URL } = process.env;
  const address = `${REACT_APP_SERVER_URL}`;
  return io(`${address}/${namespace}`);
};
