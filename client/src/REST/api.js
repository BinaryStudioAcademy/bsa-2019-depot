//Instruments
import { MAIN_URL } from './config';

export const api = {
    get token() {
        return localStorage.getItem('token');
    },
    auth: {
        login(credentials) {
            return fetch(`${MAIN_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
        }
    }
};
