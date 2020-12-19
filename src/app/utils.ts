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
  return val !== null && typeof val === 'object' && !isArray(val);
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

export const extractArrayDepth = (arr: any[]) => {
  let depth = 0;
  let current = arr;
  while (Array.isArray(current) && current.length > 0) {
    current = current[0];
    depth++;
  }
  return depth;
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

export const getFirstValueFromObject = (key: string, arr: object[]) => {
  for (const obj of arr) {
    if (isNotNullOrUndefined(obj[key])) return obj[key];
  }
  for (const obj of arr) {
    if (isNull(obj[key])) return null;
    // tslint:disable-next-line: no-unused-expression
    else if (isUndefined(obj[key])) undefined;
  }
};

/* util function from stackoverflow to color the json object */
export const syntaxHighlight = (json: string) => {
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
};
