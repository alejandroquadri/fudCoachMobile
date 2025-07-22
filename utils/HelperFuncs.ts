export const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
export const lbsToKg = (lb: number) => Math.round(lb / 2.20462);

export const cmToImperial = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const imperialToCm = (feet: number, inches: number) => {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
};

export const capitalizeFirst = (str?: string): string =>
  str ? str[0].toUpperCase() + str.slice(1) : '';
