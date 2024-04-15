import { Pipe, PipeTransform } from '@angular/core';

import { AppFunctions } from '../app-functions';

@Pipe({
  name: 'tabIsActiveLink',
  standalone: true
})
export class TabIsActiveLinkPipe implements PipeTransform {
  transform(value: string, activeLink: string | null | undefined): boolean {
    return AppFunctions.getLinkValue(value) === activeLink;
  }
}
