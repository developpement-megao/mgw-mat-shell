import { Pipe, PipeTransform } from '@angular/core';

import { AppFunctions } from '../app-functions';

@Pipe({
  name: 'linkIsActiveLink',
  standalone: true
})
export class LinkIsActiveLinkPipe implements PipeTransform {
  transform(value: string, activeLink: string | null | undefined): boolean {
    return AppFunctions.getLinkValue(value) === activeLink;
  }
}
