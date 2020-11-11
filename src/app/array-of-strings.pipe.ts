import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayOfStrings',
})
export class ArrayOfStringsPipe implements PipeTransform {
  transform(arr: string[]): unknown {
    return arr.join(', ');
  }
}
