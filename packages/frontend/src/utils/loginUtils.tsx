export const navigateByRole = (role: number) => {
  const path = (() => {
    switch (role) {
      case 1: // ADMIN
        return '/admin';
      case 2: // USER
        return '/home';
      case 3: // CLIENTE
        return '/home';
      default:
        return '/';
    }
  })();
  
  return path;
};
