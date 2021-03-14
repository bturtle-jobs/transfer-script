import { OwpStorage } from 'owp/common';
import { STORAGE_ACCESS_TOKEN_KEY } from 'owp/constants';

export function getAccessToken() {
    return OwpStorage.getItem(STORAGE_ACCESS_TOKEN_KEY);
}

export function setAccessToken(value) {
    OwpStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, value);
}

export function removeAccessToken() {
    return OwpStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY);
}
