export const navigateByRole = (role: number) => {

  const path = (() => {
    switch (role) {
      case 1:
        return '/admin';
      case 2:
        return '/home';
      case 3:
        return '/home';
      default:
        return '/';
    }
  })();
  
  return path;
};
