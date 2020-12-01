export const json = {
  "name": 'bob',
  "age": 12,
  "married": false,
  "working": true,
  "carType": null,
  "hobbies": ['running', 'grilling'],
  "available": null,
  "favouriteLaptop": {
    "lapName": 'mac',
    "lapPreis": 1200,
    "lapColor": 'grey',
    "lapData": {
      "cpu": '1.2Ghz',
      "storage": 255,
    },
  },
  "gridData": [
    [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
    ],
  ],
  "gridDataWithOptionalParams": [
    { x: 1, y: 2 },
    { x: 1, y: 2, z: 3 },
    { x: 1, y: 2, z: 3, f: 12 },
  ],
};


const firstJson = `{
  "quiz": {
      "sport": {
          "q1": {
              "question": "Which one is correct team name in NBA?",
              "options": [
                  "New York Bulls",
                  "Los Angeles Kings",
                  "Golden State Warriros",
                  "Huston Rocket"
              ],
              "answer": "Huston Rocket"
          }
      },
      "maths": {
          "q1": {
              "question": "5 + 7 = ?",
              "options": [
                  "10",
                  "11",
                  "12",
                  "13"
              ],
              "answer": "12"
          },
          "q2": {
              "question": "12 - 8 = ?",
              "options": [
                  "1",
                  "2",
                  "3",
                  "4"
              ],
              "answer": "4"
          }
      }
  }
}`;


 const secondJson = `{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}`;

 const thirdJson = `{
  "name": 'bob',
  "age": 12,
  "married": false,
  "working": true,
  "carType": null,
  "hobbies": ['running', 'grilling'],
  "available": null,
  "favouriteLaptop": {
    "lapName": 'mac',
    "lapPreis": 1200,
    "lapColor": 'grey',
    "lapData": {
      "cpu": '1.2Ghz',
      "storage": 255,
    },
  },
  "gridData": [
    [
      { "x": 1, "y": 2 },
      { "x": 2, "y": 3 },
    ],
  ],
  "gridDataWithOptionalParams": [
    { "x": 1, "y": 2 },
    { "x": 1, "y": 2, "z": 3 },
    { "x": 1, "y": 2, "z": 3, "f": 12 },
  ],
}`;
export const jsonSamples = [firstJson , secondJson , thirdJson];