export interface ShellMenuLinkAvatar {
  avatarImgSrc: string;
  avatarImgAlt?: string;
}

export interface ShellMenuGroups {
  groupLibelle: string;
}

export interface ShellMenuLinks extends Partial<ShellMenuGroups> {
  shellLink: string;
  linkLabel: string;
  linkIcone?: string;
  linkSubtitle?: string;
  linkAvatar?: ShellMenuLinkAvatar | string;
  linkMetaIcone?: string;
}

export type ShellMenuElems = ShellMenuLinks | ShellMenuGroups | string | true;
