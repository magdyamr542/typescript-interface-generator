import { Injectable } from '@angular/core';
import { json } from 'src/json';

interface InterfaceEntityInterface {
  key: string;
  overallTypeAsString: string;
  childs?: InterfaceEntity[];
}

type LimitedJsonValueTypes = string | number | boolean;
type JsonValueTypes = LimitedJsonValueTypes | object | null;

class InterfaceEntity implements InterfaceEntityInterface {
  key: string;
  _overallTypeAsString: string; // the parent tells me what my name should be if my type is object
  childs?: InterfaceEntity[];
  _isArray: boolean = false;
  _isEmptyObject?: boolean = false;

  get overallTypeAsString() {
    if (this._isArray) return this._overallTypeAsString.replace('[]', '');
    return this._overallTypeAsString;
  }

  get overallTypeAsStringInline() {
    return this._overallTypeAsString;
  }

  constructor(key: string, json: JsonValueTypes, overallTypeAsString?: string) {
    this.key = key;
    this.childs = []; // if iam an object then i would have childs that will be generated in the build up proccess
    /* generate the type of this prop if it is simple */
    this._overallTypeAsString = overallTypeAsString
      ? overallTypeAsString
      : this._generateOverallTypeAsString(json as LimitedJsonValueTypes);
    if (json === null) {
      return;
    }
    if (Array.isArray(json)) {
      this._isArray = true;
      if (typeof json[0] === 'object') this._buildUpObject(json[0]);
    } else if (typeof json === 'object') this._buildUpObject(json);
  }

  // takes the json value . it might be array or string or any type.
  private _buildUpObject(json: object) {
    const entries = Object.entries(json);
    if (entries.length === 0) this._isEmptyObject = true;
    for (const entry of entries) {
      const child = this._generateChild(entry[0], entry[1]);
      this.childs.push(child);
    }
  }

  private _generateOverallTypeAsString(val: LimitedJsonValueTypes): string {
    return typeof val;
  }
  private _generateTypeNameFromKey(key: string, val: any): string {
    if (val === null) return 'null';
    const isArray = Array.isArray(val);
    if (isArray && typeof val[0] !== 'object') {
      return typeof val[0] + '[]';
    }
    if (isArray)
      return key[0].toUpperCase() + key.substring(1) + 'Interface' + '[]';
    return key[0].toUpperCase() + key.substring(1) + 'Interface';
  }

  _generateChild(key: string, val: any): InterfaceEntity {
    if (typeof val === 'object' || Array.isArray(val)) {
      /* then this is a new interface and we need a name for it */
      const interfaceName = this._generateTypeNameFromKey(key, val);
      const childWithName: InterfaceEntity = new InterfaceEntity(
        key,
        val,
        interfaceName
      );
      return childWithName;
    }
    const child: InterfaceEntity = new InterfaceEntity(key, val);
    return child;
  }

  getTypeDefinition() {
    const defs: string[] = [];
    this._getTypeDefinitionsArray(defs);
    return defs.join('\n\n');
  }

  private _getTypeDefinitionsArray(defs: string[]) {
    /* this is an object which is an interface */
    let result = '';
    result += `export interface ${this.overallTypeAsString} { \n`;
    for (const child of this.childs) {
      result += `${child.key} : ${child.overallTypeAsStringInline}; \n`;
      /* append new defs because we have a new interface */
      if (child.childs.length !== 0 || child._isEmptyObject) {
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
    console.log(this, this.generateInterface(json));
  }
  generateInterface(json: Object) {
    const root: InterfaceEntity = new InterfaceEntity(
      'Root',
      json,
      'RootInterface'
    );
    return root.getTypeDefinition();
  }
}
