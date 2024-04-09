import { KeyValue, KeyValuePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MediaMatcher } from '@angular/cdk/layout';

import { ThemePalette } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LinkIsActiveLinkPipe } from './pipes/link-is-active-link.pipe';
import { MenuElemGetGroupPipe } from './pipes/menu-elem-get-group.pipe';
import { MenuElemGetLinkPipe, menuElemIsLink } from './pipes/menu-elem-get-link.pipe';

export type BooleanInputTrueFalse = 'true' | 'false' | '1' | boolean | null | undefined;

export interface AppShellMenuLinks {
  shellLink: string;
  linkLabel: string;
  linkIcone?: string;
  linkSubtitle?: string;
}

export interface AppShellMenuGroups {
  groupLibelle: string;
}

export type AppShellMenuElems = AppShellMenuLinks | AppShellMenuGroups | string | true;

export interface AppShellMenuActions {
  menuText: string;
  menuIco?: string;
}

export type AppShellActionKey = string | number;

@Component({
  selector: 'mgw-mat-shell',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    RouterLink,
    LinkIsActiveLinkPipe,
    MenuElemGetGroupPipe,
    MenuElemGetLinkPipe,
    NgTemplateOutlet,
    KeyValuePipe
  ],
  templateUrl: './mgw-mat-shell.component.html',
  styleUrls: ['./mgw-mat-shell.component.scss']
})
export class MgwMatShellComponent implements OnInit, OnDestroy {
  @Input() linksList: ReadonlyArray<AppShellMenuElems> | undefined;
  @Input() isSidenavOpened: BooleanInputTrueFalse | undefined;
  @Input() appTitle: string | undefined;
  @Input() toolbarColor: ThemePalette | undefined;
  @Input() forceMode: MatDrawerMode | undefined;
  @Input() forceModeMobile: MatDrawerMode | undefined;
  @Input() forceModeDesktop: MatDrawerMode | undefined;
  @Input() sidenavDisableClose: BooleanInputTrueFalse | undefined;
  @Input() snavIconOpened: string | undefined;
  @Input() snavIconClosed: string | undefined;
  @Input() activeLink: string | null | undefined;
  @Input() appLogo: string | undefined;
  @Input() menuActionIcon: string | undefined;
  @Input() actionsList: ReadonlyMap<AppShellActionKey, AppShellMenuActions> | undefined;
  @Input() contentTemplate: TemplateRef<unknown> | null | undefined;

  @Output() readonly changeLinkNav: EventEmitter<string> = new EventEmitter<string>();
  @Output() readonly clicBtAction: EventEmitter<AppShellActionKey> = new EventEmitter<AppShellActionKey>();

  @ViewChild('snav') snav: MatSidenav | undefined;

  private readonly mobileQueryListener: () => void;

  readonly iconSidenavOpened = 'menu_open';
  readonly iconSidenavClosed = 'menu';

  readonly sidenavModeMobile = 'over';
  readonly sidenavModeDesktop = 'side';

  readonly logoAltDef = 'Logo';

  readonly iconMenuAction = 'more_vert';

  readonly mobileQuery: MediaQueryList;

  sidenavOpening: boolean | undefined;

  constructor(changeDetectorRef: ChangeDetectorRef, mediaMatcher: MediaMatcher) {
    this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = (): void => changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  toggleSidenav(): void {
    this.snav?.toggle().catch((resu) => {
      console.warn('AppShell comp toggleSidenav toggle sidenav snav resu ERREUR', resu);
    });
  }

  sidenavOpenedStart(): void {
    this.sidenavOpening = true;
  }

  sidenavOpenedChange(openState: boolean): void {
    this.sidenavOpening = openState;
  }

  clicLink(link: string): void {
    // sur clic sur lien on va fermer le sidenav si on est en version mobile (pas en mode side)
    if (this.snav?.disableClose !== true && this.snav?.mode !== 'side') {
      this.snav?.close().catch((resu) => {
        console.warn('AppShell comp clicLink close sidenav snav resu ERREUR', resu);
      });
    }
    this.changeLinkNav.emit(link);
  }

  trackByLinkFn(index: number, item: AppShellMenuElems): string | number {
    if (menuElemIsLink(item)) {
      // on est sur un lien l'identifiant est le shellLink
      return item.shellLink;
    }
    // sinon identifiant index
    return index;
  }

  trackByActionFn(index: number, item: KeyValue<AppShellActionKey, AppShellMenuActions>): AppShellActionKey | number {
    return item.key === '' || (typeof item.key === 'number' && isNaN(item.key)) ? index : item.key;
  }

  clicAction(actionKey: AppShellActionKey): void {
    this.clicBtAction.emit(actionKey);
  }

  compareKeyValueActions(): number {
    return 0;
  }
}
