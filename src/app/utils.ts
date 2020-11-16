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

export const extractFirstArray = (value: any[]) => {
  while (isArray(value)) {
    if (isObject(value[0]) && !isArray(value[0])) return value;
    value = value[0];
  }
  return value;
};

export const extractFirstArrayMember = (value: any[]): any | null => {
  while (isArray(value)) {
    if (value.length === 0) return null;
    value = value[0];
  }
  return value as any;
};

export const isNotNullOrUndefined = (val: any) => {
  return !isNull(val) && !isUndefined(val);
};

export const isNull = (val: any) => {
  return val === null;
};

export const isUndefined = (val: any) => {
  return val === undefined;
};

export const getFirstValueFromobject = (key: string, arr: object[]) => {
  for (const obj of arr) {
    if (isNotNullOrUndefined(obj[key])) return obj[key];
  }
  for (const obj of arr) {
    if (isNull(obj[key])) return null;
    // tslint:disable-next-line: no-unused-expression
    else if (isUndefined(obj[key])) undefined;
  }
};
