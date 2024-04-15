export class AppFunctions {
  static getLinkValue(linkValue: string): string {
    return linkValue && typeof linkValue === 'string' && linkValue.startsWith('/') ? linkValue : `/${linkValue ?? ''}`;
  }
}
