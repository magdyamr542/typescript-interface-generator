import { Injectable } from '@angular/core';
import { json } from 'src/json';
import {
  extractFirstArray,
  extractFirstArrayMember,
  isArray,
  isEmptyArray,
  isNotNullOrUndefined,
  isObject,
  getFirstValueFromobject,
} from './utils';

/* TYPES DEFINITION */
type LimitedJsonValueTypes = string | number | boolean;
type ValueTypes = LimitedJsonValueTypes | object | null;
enum Kind {
  NORMAL,
  ARRAY,
  OBJECT,
}
interface InterfaceEntityInterface {
  key: string;
  value: ValueTypes;
  overallTypeAsString: string;
  kind: Kind;
  childs?: InterfaceEntity[];
  required?: boolean;
}
interface RequiredOrOptionalPropsInterface {
  [key: string]: {
    required: boolean;
    value: any;
  };
}

/* THE MAIN SERVICE */
class InterfaceEntity implements InterfaceEntityInterface {
  key: string; // the key in the json
  value: ValueTypes; // the value which corrsponds to some key
  kind: Kind;
  childs?: InterfaceEntity[];
  _overallTypeAsString: string; // the parent tells me what my name should be if my type is object
  _required: boolean;

  get overallTypeAsString() {
    return this._overallTypeAsString;
  }

  constructor(key: string, value: ValueTypes, required?: boolean) {
    this._required = required === undefined ? true : required;
    this.key = key;
    this.value = value;
    this.childs = []; // if iam an object then i would have childs that will be generated in the build up proccess
    /* generate the type of this prop if it is simple */
    this._setKind(value);
    this._overallTypeAsString = this._generateOverallTypeAsString(value);
    this._processObject(key, value);
  }

  /* set the kind of the object which will help later decide which type it should have */
  private _setKind(value: ValueTypes) {
    if (Array.isArray(value)) {
      this.kind = Kind.ARRAY;
    } else if (isObject(value)) {
      this.kind = Kind.OBJECT;
    } else {
      this.kind = Kind.NORMAL;
    }
  }

  // processing the object and generating the child of the current key value pair
  private _processObject(key: string, value: ValueTypes) {
    if (this.kind === Kind.OBJECT) {
      const childs = this._generateChildsFromObject(key, value as object);
      this.childs.push(...childs);
    } else if (this.kind === Kind.ARRAY) {
      if (isEmptyArray(value as any[])) return;
      const firstItem = extractFirstArrayMember(value as any[]);
      if (isObject(firstItem)) {
        const arrayWithObjects = extractFirstArray(value as any[]);
        const requiredAndOptionalProps = this._getRequiredAndOptionalProps(
          arrayWithObjects as object[]
        );
        const obj = this._getRequiredAndOptionalPropsAsJsobObject(
          requiredAndOptionalProps
        );
        const childs = this._generateChildsFromObject(
          key,
          obj,
          requiredAndOptionalProps
        );
        this.childs.push(...childs);
      }
    }
  }

  private _getRequiredAndOptionalPropsAsJsobObject(
    val: RequiredOrOptionalPropsInterface
  ) {
    const entries = Object.entries(val);
    const obj = entries.reduce((prev, curr) => {
      return { ...prev, [curr[0]]: curr[1].value };
    }, {});
    return obj;
  }

  private _generateChildsFromObject(
    key: string,
    value: object,
    requiredAndOptionalProps?: RequiredOrOptionalPropsInterface
  ) {
    const entries = Object.entries(value);
    const result: InterfaceEntity[] = [];
    for (const entry of entries) {
      let child;
      if (requiredAndOptionalProps) {
        child = new InterfaceEntity(
          entry[0],
          entry[1],
          requiredAndOptionalProps[entry[0]].required
        );
      } else {
        child = new InterfaceEntity(entry[0], entry[1], true);
      }
      result.push(child);
    }
    return result;
  }

  /* getting the required and optional props from an array of objects */
  private _getRequiredAndOptionalProps(objArr: object[]) {
    const length = objArr.length;
    const keyMap: { [key: string]: number } = {};
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < objArr.length; i++) {
      const keys = Object.keys(objArr[i]);
      for (const key of keys) {
        if (isNotNullOrUndefined(keyMap[key])) keyMap[key]++;
        else keyMap[key] = 1;
      }
    }
    /* for each property check if it was in each and every single entry of the array */
    const result: RequiredOrOptionalPropsInterface = {};
    const keyMapEntries = Object.entries(keyMap);
    for (const entry of keyMapEntries) {
      result[entry[0]] = {
        required: entry[1] === objArr.length,
        value: getFirstValueFromobject(entry[0], objArr),
      };
    }
    return result;
  }

  /* recursive util to generate the overall type of the object */
  private _generateOverallTypeAsString(value: ValueTypes): string {
    if (value === null) return 'null';
    if (isArray(value)) {
      if (isEmptyArray(value as any[])) return 'any[]';
      const firstItem = value[0];
      return this._generateOverallTypeAsString(firstItem) + '[]';
    } else if (isObject(value)) {
      return this._generateTypeNameFromKey(this.key);
    } else {
      return typeof value;
    }
  }
  private _generateTypeNameFromKey(key: string): string {
    return key.charAt(0).toUpperCase() + key.substring(1) + 'Interface';
  }

  /* recursive util to get the type definition from the current json object */
  getTypeDefinition() {
    const defs: string[] = [];
    this._getTypeDefinitionsArray(defs);
    return defs.join('\n\n');
  }

  _generateNameFromPriority(key: string, required: boolean) {
    return required ? key : key + '?';
  }

  private async _getTypeDefinitionsArray(defs: string[]) {
    /* this is an object which is an interface */
    let result = '';
    const nameFromKey = this._generateTypeNameFromKey(this.key);
    result += `export interface ${nameFromKey} { \n`;
    for (const child of this.childs) {
      result += `${this._generateNameFromPriority(
        child.key,
        child._required
      )} : ${child.overallTypeAsString}; \n`;
      /* append new defs because we have a new interface */
      if (child.childs.length !== 0 || child.kind === Kind.OBJECT) {
        child._getTypeDefinitionsArray(defs);
      }
    }
    result += '}';
    defs.push(result);
  }
}

// tslint:disable-next-line: max-classes-per-file
@Injectable({
  providedIn: 'root',
})
export class InterfaceGeneratorService {
  constructor() {
    console.log(this.generateInterface(json));
  }
  generateInterface(json: object) {
    const root: InterfaceEntity = new InterfaceEntity('Root', json);
    console.log(root);
    return root.getTypeDefinition();
  }
}
