
export const calculateDeliveryDate = () => {
  const today = new Date();
  const minimumDays = 3;

  const deliveryDate = new Date(today);
  let addedDays = 0;

  while (addedDays < minimumDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      addedDays++;
    }
  }

  const formattedDate = deliveryDate.toISOString().slice(0, 19).replace('T', ' ');
  return formattedDate;
};