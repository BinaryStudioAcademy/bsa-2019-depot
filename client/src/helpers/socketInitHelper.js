import io from 'socket.io-client';

export const socketInit = namespace => {
  const { REACT_APP_SOCKET_SERVER, REACT_APP_SOCKET_SERVER_PORT } = process.env;
  const address = `http://${REACT_APP_SOCKET_SERVER}:${REACT_APP_SOCKET_SERVER_PORT}`;
  this.socket = io(`${address}/${namespace}`);
};
