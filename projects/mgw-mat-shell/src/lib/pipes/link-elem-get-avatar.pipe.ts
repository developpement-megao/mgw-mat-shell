import { Pipe, PipeTransform } from '@angular/core';
import { ShellMenuLinkAvatar } from '../models/shell-menu-elems';

@Pipe({
  name: 'linkElemGetAvatar',
  standalone: true
})
export class LinkElemGetAvatarPipe implements PipeTransform {
  transform(value: ShellMenuLinkAvatar | string | undefined): ShellMenuLinkAvatar | undefined {
    if (value !== undefined) {
      if (typeof value === 'string') {
        return value === '' ? undefined : { avatarImgSrc: value };
      }
      return value;
    }
    return undefined;
  }
}
