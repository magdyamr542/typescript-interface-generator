import { Injectable } from '@angular/core';
import { json } from 'src/json';
import { isArray, isEmptyArray, isObject } from './utils';

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
  childs?: InterfaceEntity[];
  kind: Kind;
}

interface RequiredOrOptionalPropsInterface {
  [key: string]: {
    required: boolean;
    val: any;
  };
}

class InterfaceEntity implements InterfaceEntityInterface {
  key: string; // the key in the json
  value: ValueTypes; // the value which corrsponds to some key
  _overallTypeAsString: string; // the parent tells me what my name should be if my type is object
  childs?: InterfaceEntity[];
  _isEmptyObject?: boolean = false;
  kind: Kind;

  get overallTypeAsString() {
    return this._overallTypeAsString;
  }

  constructor(key: string, value: ValueTypes) {
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

  private _processObject(key: string, value: ValueTypes) {
    if (this.kind === Kind.OBJECT) {
      const childs = this._generateChildsFromObject(key, value as object);
      this.childs.push(...childs);
    } else if (this.kind === Kind.ARRAY) {
      if (isEmptyArray(value as any[])) return;
      const firstItem = value[0];
      if (isObject(firstItem) || isArray(firstItem)) {
        const childs = this._generateChildsFromObject(key, firstItem as object);
        this.childs.push(...childs);
      }
    }
  }
  private _generateChildsFromObject(key: string, value: object) {
    const entries = Object.entries(value);
    const result: InterfaceEntity[] = [];
    for (const entry of entries) {
      const child = new InterfaceEntity(entry[0], entry[1]);
      result.push(child);
    }
    return result;
  }

  private _generateChildSimple(key: string, value: ValueTypes) {
    return new InterfaceEntity(key, value);
  }

  // /* getting the required and optional props from an array of objects */
  // private _getRequiredAndOptionalProps(objArr: object[]) {
  //   const length = objArr.length;
  //   const keyMap: { [key: string]: number } = {};
  //   // tslint:disable-next-line: prefer-for-of
  //   for (let i = 0; i < objArr.length; i++) {
  //     const keys = Object.keys(objArr[i]);
  //     for (const key of keys) {
  //       if (keyMap[key]) keyMap[key]++;
  //       else keyMap[key] = 1;
  //     }
  //   }
  //   /* for each property check if it was in each and every single entry of the array */
  //   const result: RequiredOrOptionalPropsInterface = {};
  //   const keyMapEntries = Object.entries(keyMap);
  //   for (const entry of keyMapEntries) {
  //     result[entry[0]] = {
  //       required: entry[1] === objArr.length,
  //       val: this._getFirstValueTestFromArray(entry[0], objArr),
  //     };
  //   }
  //   return result;
  // }

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

  getTypeDefinition() {
    const defs: string[] = [];
    this._getTypeDefinitionsArray(defs);
    return defs.join('\n\n');
  }

  private async _getTypeDefinitionsArray(defs: string[]) {
    /* this is an object which is an interface */
    let result = '';
    result += `export interface ${this._generateTypeNameFromKey(
      this.key
    )} { \n`;
    for (const child of this.childs) {
      result += `${child.key} : ${child.overallTypeAsString}; \n`;
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
