export const formattedDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toDateString();
}

export const formattedPrice = (price: number) => {
  return price.toFixed(2);
}

export const formattedState = (state: number) => {
  switch (state) {
    case 1:
      return 'Activo';
    case 2:
      return 'Inactivo';
    case 3:
      return 'En proces';
    default:
      return 'Desconocido';
  }
}

export const formattedRole = (role: number) => {
  switch (role) {
    case 1:
      return 'Admin';
    case 2:
      return 'User';
    case 3:
      return 'Cliente';
    default:
      return 'Desconocido';
  }
}