import { useState } from 'react';
import UserInterface from '../interfaces/UserInterface';

export const useUserLocalStorage = (keyName: string, user: null | UserInterface) => {
    const [storedValue, setStoredValue] = useState(() => {
        const value = window.localStorage.getItem(keyName);

        if (value) {
            return JSON.parse(value);
        }
        window.localStorage.setItem(keyName, JSON.stringify(user));
        return user;
    });

    const setValue = (user: UserInterface | null) => {
        window.localStorage.setItem(keyName, JSON.stringify(user));
        setStoredValue(user);
    };

    return [storedValue, setValue];
};

export const useTokenLocalStorage = (keyName: string, accessToken: string | null) => {
    const [storedValue, setStoredValue] = useState(() => {
        const value = window.localStorage.getItem(keyName);

        if (value) {
            return JSON.parse(value);
        }
        window.localStorage.setItem(keyName, JSON.stringify(accessToken));
        return accessToken;
    });

    const setValue = (accessToken: string | null) => {
        window.localStorage.setItem(keyName, JSON.stringify(accessToken));
        setStoredValue(accessToken);
    };

    return [storedValue, setValue];
};
