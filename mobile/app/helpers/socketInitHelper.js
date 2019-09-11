import io from 'socket.io-client';
import { MOBILE_SERVER } from 'react-native-dotenv';

export const socketInit = namespace => {
  const address = `${MOBILE_SERVER}`;
  return io(`${address}/${namespace}`);
};
