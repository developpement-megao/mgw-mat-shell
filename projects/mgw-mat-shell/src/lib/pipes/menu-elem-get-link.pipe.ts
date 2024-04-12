import { Pipe, PipeTransform } from '@angular/core';

import { ShellMenuElems, ShellMenuLinks } from '../models/shell-menu-elems';

export function menuElemIsLink(elem: ShellMenuElems): elem is ShellMenuLinks {
  return (elem as ShellMenuLinks).shellLink !== undefined;
}
@Pipe({
  name: 'menuElemGetLink',
  standalone: true
})
export class MenuElemGetLinkPipe implements PipeTransform {
  transform(value: ShellMenuElems): ShellMenuLinks | null {
    if (menuElemIsLink(value)) {
      return value;
    }
    return null;
  }
}
