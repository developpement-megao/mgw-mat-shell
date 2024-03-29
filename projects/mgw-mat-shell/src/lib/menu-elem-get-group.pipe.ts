import { Pipe, PipeTransform } from '@angular/core';

import { AppShellMenuElems, AppShellMenuGroups } from './mgw-mat-shell.component';

function menuElemIsGroup(elem: AppShellMenuElems): elem is AppShellMenuGroups {
  return (elem as AppShellMenuGroups).groupLibelle !== undefined;
}

@Pipe({
  name: 'menuElemGetGroup',
  standalone: true
})
export class MenuElemGetGroupPipe implements PipeTransform {
  transform(value: AppShellMenuElems): AppShellMenuGroups | null {
    if (typeof value === 'string') {
      return { groupLibelle: value };
    }
    if (menuElemIsGroup(value)) {
      return value;
    }
    return null;
  }
}
