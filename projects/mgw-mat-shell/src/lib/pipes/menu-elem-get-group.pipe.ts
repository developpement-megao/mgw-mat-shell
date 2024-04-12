import { Pipe, PipeTransform } from '@angular/core';

import { ShellMenuElems, ShellMenuGroups } from '../models/shell-menu-elems';

function menuElemIsGroup(elem: ShellMenuElems): elem is ShellMenuGroups {
  return (elem as ShellMenuGroups).groupLibelle !== undefined;
}

@Pipe({
  name: 'menuElemGetGroup',
  standalone: true
})
export class MenuElemGetGroupPipe implements PipeTransform {
  transform(value: ShellMenuElems): ShellMenuGroups | null {
    if (typeof value === 'string') {
      return { groupLibelle: value };
    }
    if (menuElemIsGroup(value)) {
      return value;
    }
    return null;
  }
}
