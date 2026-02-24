import Cookies from 'js-cookie';

const KEY = 'access_token';

export const getToken   = (): string      => Cookies.get(KEY) ?? '';
export const setToken   = (t: string)     => Cookies.set(KEY, t, { secure: true, sameSite: 'strict', expires: 1 });
export const clearToken = ()              => Cookies.remove(KEY);
