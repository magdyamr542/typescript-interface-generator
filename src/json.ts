export const json = {
  name: 'bob',
  age: 12,
  married: false,
  working: true,
  hobbies: ['running', 'grilling'],
  available: null,
  favouriteLaptop: {
    lapName: 'mac',
    lapPreis: 1200,
    lapColor: 'grey',
    lapData: {
      cpu: '1.2Ghz',
      storage: 255,
    },
  },
  gridData: [
    [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
    ],
  ],
  gridDataWithOptionalParams: [
    { x: 1, y: 2 },
    { x: 1, y: 2, z: 3 },
    { x: 1, y: 2, z: 3, f: 12 },
  ],
};
