import { Injectable } from '@angular/core';
import { ROOT } from './consts';
import {
  extractFirstArray,
  extractFirstArrayMember,
  isArray,
  isEmptyArray,
  isNotNullOrUndefined,
  isObject,
  getFirstValueFromObject,
  extractArrayDepth,
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
  _parent: InterfaceEntity | null = null;
  _overallTypeAsString: string; // the parent tells me what my name should be if my type is object
  _required: boolean;
  _entityContainer?: InterfaceEntity[];
  _depth: number = 0;
  _duplicate: number = 0;
  _enableRequiredAndOptionalProps?;

  constructor(
    key: string,
    value: ValueTypes,
    parent: InterfaceEntity,
    required?: boolean,
    enableRequiredAndOptionalProps?: boolean
  ) {
    this._required = required === undefined ? true : required;
    this._enableRequiredAndOptionalProps =
      enableRequiredAndOptionalProps === undefined
        ? true
        : enableRequiredAndOptionalProps;
    this.key = key;
    this.value = value;
    this.childs = []; // if iam an object then i would have childs that will be generated in the build up proccess
    this._parent = parent;
    /* generate the type of this prop if it is simple */
    this._setConfig(value);
    this._checkForDuplicates(key);
    this._overallTypeAsString = this._generateOverallTypeAsString(value);
    this._processObject(value); // process the current json and generate its children in the graph
  }

  get overallTypeAsString() {
    let brackets = '';
    if (this.kind == Kind.ARRAY) {
      brackets += this._depth === 0 ? '[]' : '';
      for (let i = 0; i < this._depth; i++) {
        brackets += '[]';
      }
    }
    return this._generateTypeFromKeyHelper() + brackets;
  }

  get enableRequiredAndOptionalProps() {
    if (this._isRoot()) return this._enableRequiredAndOptionalProps;
    return this._getRoot().enableRequiredAndOptionalProps;
  }

  /* Checking if the name is a duplicate */
  private _checkForDuplicates(key: string) {
    const sameEntities = this._getRoot()._entityContainer.filter(
      (entity) => entity.key === key && entity !== this
    );

    this._duplicate = sameEntities.length;
  }

  /* set the kind of the object which will help later decide which type it should have */
  private _setConfig(value: ValueTypes) {
    if (Array.isArray(value)) {
      this.kind = Kind.ARRAY;
      this._depth = extractArrayDepth(value);
    } else if (isObject(value)) {
      this.kind = Kind.OBJECT;
    } else {
      this.kind = Kind.NORMAL;
    }
    this._setEntityContainer();
  }

  /* Setting the Entity Container of the root */
  private _setEntityContainer() {
    if (this._isRoot()) {
      this._entityContainer = [];
    } else {
      this._getRoot()._entityContainer.push(this);
    }
  }

  private _getRoot() {
    let root: InterfaceEntity = this;
    while (root._parent !== null) {
      root = root._parent;
    }
    return root;
  }

  private _isRoot() {
    return this.key === 'Root';
  }

  // processing the object and generating the child of the current key value pair
  private _processObject(value: ValueTypes) {
    let childs: InterfaceEntity[];
    if (this.kind === Kind.OBJECT) {
      childs = this._generateChildsFromObject(value as object);
      this.childs.push(...childs);
    } else if (this.kind === Kind.ARRAY) {
      if (isEmptyArray(value as any[])) return;
      const firstItem = extractFirstArrayMember(value as any[]);
      if (isObject(firstItem)) {
        if (!this.enableRequiredAndOptionalProps) {
          // not supporting optional props
          childs = this._generateChildsFromObject(firstItem);
          this.childs.push(...childs);
          return;
        }
        // supporting optional props
        const arrayWithObjects = extractFirstArray(value as any[]);
        // loop throw the array of objects and detect the required and the optional props
        const requiredAndOptionalProps = this._getRequiredAndOptionalProps(
          arrayWithObjects as object[]
        );
        const requiredAndOptionalPropsAsJson = this._getRequiredAndOptionalPropsAsJsobObject(
          requiredAndOptionalProps
        );
        childs = this._generateChildsFromObject(
          requiredAndOptionalPropsAsJson,
          requiredAndOptionalProps
        );
        this.childs.push(...childs);
      }
    }
  }

  /* Transform a hashmap as json object */
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
    value: object,
    requiredAndOptionalProps?: RequiredOrOptionalPropsInterface
  ) {
    const entries = Object.entries(value);
    const result: InterfaceEntity[] = [];
    for (const entry of entries) {
      let child: InterfaceEntity;
      if (requiredAndOptionalProps) {
        child = new InterfaceEntity(
          entry[0],
          entry[1],
          this,
          requiredAndOptionalProps[entry[0]].required // used for components which are not required
        );
      } else {
        child = new InterfaceEntity(entry[0], entry[1], this, true);
      }
      result.push(child);
    }
    return result;
  }

  /* getting the required and optional props from an array of objects */
  private _getRequiredAndOptionalProps(objArr: object[]) {
    const keyMap: { [key: string]: number } = {}; // map each key to the number of its occurance
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
        value: getFirstValueFromObject(entry[0], objArr),
      };
    }
    return result;
  }

  /* recursive util to generate the overall type of the object */
  private _generateOverallTypeAsString(value: ValueTypes): string {
    if (value === null) return 'null';
    else if (isObject(value)) {
      return this._generateTypeNameFromKey(this.key);
    } else if (isArray(value)) {
      if (isEmptyArray(value as any[])) return 'any';
      const firstItem = extractFirstArrayMember(value as any[]);
      return this._generateOverallTypeAsString(firstItem);
    } else {
      return typeof value;
    }
  }

  private _generateTypeFromKeyHelper() {
    if (this.kind === Kind.OBJECT) {
      const sequence = this._duplicate === 0 ? '' : this._duplicate;
      return this._overallTypeAsString + sequence; // used to avoid the same keys being used as interface names
    } else {
      return this._overallTypeAsString;
    }
  }

  /* Generate the name from the key in the Json. menu => Menu */
  private _generateTypeNameFromKey(key: string): string {
    return key.charAt(0).toUpperCase() + key.substring(1);
  }

  _generateNameFromPriority(key: string, required: boolean) {
    let result = key.trim();
    return required ? result : result + '?';
  }

  private async _getTypeDefinitionsArray(defs: string[]) {
    /* this is an object which is an interface */
    let result = '';
    const interfaceName = this._generateTypeFromKeyHelper();
    // head
    result += `export interface ${interfaceName} { \n`;
    // body
    for (const child of this.childs) {
      result += ` ${this._generateNameFromPriority(
        child.key,
        child._required
      )} : ${child.overallTypeAsString}; \n`;
      /* append new defs because we have a new interface */
      if (child.childs.length !== 0 || child.kind === Kind.OBJECT) {
        child._getTypeDefinitionsArray(defs);
      }
    }
    // tail
    result += '}';
    defs.push(result);
  }

  /* recursive util to get the type definition from the current json object */
  public getTypeDefinition() {
    const defs: string[] = [];
    this._getTypeDefinitionsArray(defs);
    return defs.join('\n\n\n');
  }
}

// tslint:disable-next-line: max-classes-per-file
@Injectable({
  providedIn: 'root',
})
export class InterfaceGeneratorService {
  constructor() {}
  generateInterface(jsonObj: object, enableOptionalProps?: boolean) {
    // basic config
    const parent = null;
    const rootRequired = true;
    const enableRequiredAndOptionalProps =
      enableOptionalProps === undefined ? true : enableOptionalProps;
    // generate interface
    const root: InterfaceEntity = new InterfaceEntity(
      ROOT,
      jsonObj,
      parent,
      rootRequired,
      enableRequiredAndOptionalProps
    );
    // get type definitions
    const result = root.getTypeDefinition();
    return result;
  }
}
