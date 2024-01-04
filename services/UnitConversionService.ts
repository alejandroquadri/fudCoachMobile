export const convertPoundsToKilograms = (pounds: number) => {
  return pounds / 2.20462; // 1 pound = 0.453592 kg
};

export const convertKilogramsToPounds = (kilograms: number) => {
  return kilograms * 2.20462; // 1 kg = 2.20462 pounds
};

export const convertCentimetersToFeet = (centimeters: number) => {
  const totalInches = centimeters / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = round(totalInches % 12, 2); // Rounds inches to 2 decimal places

  return { feet, inches };
};

export const convertFeetToCentimeters = (feet: number, inches: number) => {
  return feet * 30.48 + inches * 2.54;
};

export const round = (value: number, decimals: number): number => {
  let d: string | number = '1';
  for (let i = 0; i < decimals; i++) {
    d += '0';
  }
  d = Number(d);
  return Math.round((value + Number.EPSILON) * d) / d;
};
