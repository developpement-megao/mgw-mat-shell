import { Pipe, PipeTransform } from '@angular/core';

import { AppShellMenuElems, AppShellMenuLinks } from './mgw-mat-shell.component';

export function menuElemIsLink(elem: AppShellMenuElems): elem is AppShellMenuLinks {
  return (elem as AppShellMenuLinks).shellLink !== undefined;
}
@Pipe({
  name: 'menuElemGetLink',
  standalone: true
})
export class MenuElemGetLinkPipe implements PipeTransform {
  transform(value: AppShellMenuElems): AppShellMenuLinks | null {
    if (menuElemIsLink(value)) {
      return value;
    }
    return null;
  }
}
