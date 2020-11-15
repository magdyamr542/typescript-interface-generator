export const generateRandomName = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const length = 10;
  let result = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    result += chars[index];
  }
  return result;
};

export const generateRandomNumber = (max): number => {
  return Math.floor(Math.random() * max);
};

export const generateRandomAbilities = (): string[] => {
  const abilities = [
    'fly',
    'eat',
    'die',
    'fire',
    'drive',
    'swim',
    'breathe',
    'learn',
    'drive',
    'act',
  ];
  const numAbilities = generateRandomNumber(6);
  const result = [];
  for (let i = 0; i < numAbilities; i++) {
    result.push(abilities[generateRandomNumber(abilities.length)]);
  }
  return result;
};

export const isEmptyArray = (arr: any[]) => {
  return arr.length === 0;
};

export const isArray = (val: any) => {
  return Array.isArray(val);
};

export const isObject = (val: any) => {
  return typeof val === 'object' && val !== null;
};

export const isEmptyObject = (val: object) => {
  return Object.keys(val).length === 0;
};
