export const formattedDate = (date: string) => {
  try {
    // Convertir la fecha recibida en un objeto Date
    const fecha = new Date(date);

    // Validar si la fecha es válida
    if (isNaN(fecha.getTime())) {
        throw new Error("Fecha inválida");
    }

    // Opciones para formatear la fecha en español
    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Día de la semana
        year: 'numeric', // Año
        month: 'long', // Mes
        day: 'numeric', // Día del mes
    };

    // Usar Intl.DateTimeFormat para formatear la fecha
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);

    return fechaFormateada; // Ejemplo: "jueves, 9 de enero de 2025"
} catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al formatear la fecha:', errorMessage);
    return null; // Retornar null en caso de error
}
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
      return 'En proceso';
    case 6:
      return 'Rechazado';
    case 7:
      return 'Confirmado';
    case 8:
      return 'Entregado';
    default:
      return 'Desconocido';
  }
}


export const formattedRole = (role: number) => {
  switch (role) {
    case 1:
      return 'Operador';
    case 2:
      return 'Usuario';
    case 3:
      return 'Cliente';
    default:
      return 'Desconocido';
  }
}