export const storage = {
    setToken: (token: string) => localStorage.setItem('jwt_token', token),
    getToken: (): string | null => localStorage.getItem('jwt_token'),
    removeToken: () => localStorage.removeItem('jwt_token'),
};