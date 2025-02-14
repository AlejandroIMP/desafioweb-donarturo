export const isAuthenticated = () => !!localStorage.getItem("token");
export const getUserRole = () => localStorage.getItem("role");