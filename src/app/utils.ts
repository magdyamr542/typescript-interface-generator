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
