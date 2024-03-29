import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkIsActiveLink',
  standalone: true
})
export class LinkIsActiveLinkPipe implements PipeTransform {
  transform(value: string, activeLink: string | null | undefined): boolean {
    const linkValue: string = value && typeof value === 'string' && value.startsWith('/') ? value : `/${value ?? ''}`;
    return linkValue === activeLink;
  }
}
