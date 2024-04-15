import { AsyncPipe, KeyValue, KeyValuePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NumberInput } from '@angular/cdk/coercion';
import { MediaMatcher } from '@angular/cdk/layout';

import { ThemePalette } from '@angular/material/core';

import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

import { Observable, map, timer } from 'rxjs';

import { MaterialModule } from './material.module';

import { ShellActionKey } from './models/shell-action-key';

import { ShellEmitClic } from './models/shell-emit-clic';

import { ShellMenuActions } from './models/shell-menu-actions';
import { ShellMenuElems } from './models/shell-menu-elems';

import { MenuElemGetGroupPipe } from './pipes/menu-elem-get-group.pipe';
import { MenuElemGetLinkPipe, menuElemIsLink } from './pipes/menu-elem-get-link.pipe';

import { LinkElemGetAvatarPipe } from './pipes/link-elem-get-avatar.pipe';
import { LinkIsActiveLinkPipe } from './pipes/link-is-active-link.pipe';
import { ShellMenuTabs } from '../public-api';
import { TabIsActiveLinkPipe } from './pipes/tab-is-active-link.pipe';

export type BooleanInputTrueFalse = 'true' | 'false' | '1' | boolean | null | undefined;

@Component({
  selector: 'mgw-mat-shell',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    LinkIsActiveLinkPipe,
    MenuElemGetGroupPipe,
    MenuElemGetLinkPipe,
    NgTemplateOutlet,
    KeyValuePipe,
    AsyncPipe,
    LinkElemGetAvatarPipe,
    MaterialModule,
    TabIsActiveLinkPipe
  ],
  templateUrl: './mgw-mat-shell.component.html',
  styleUrls: ['./mgw-mat-shell.component.scss']
})
export class MgwMatShellComponent implements OnInit, OnDestroy {
  @Input() linksList: ReadonlyArray<ShellMenuElems> | undefined;
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
  @Input() actionsList: ReadonlyMap<ShellActionKey, ShellMenuActions> | undefined;
  @Input() contentTemplate: TemplateRef<unknown> | null | undefined;
  @Input() hasBackdrop: BooleanInputTrueFalse | undefined;
  @Input() fixedTopGap: NumberInput | undefined;
  @Input() tabsLinkList: ReadonlyArray<ShellMenuTabs> | undefined;
  @Input() tabLinkBackgroundColor: ThemePalette | undefined;

  @Output() readonly changeLinkNav: EventEmitter<ShellEmitClic> = new EventEmitter<ShellEmitClic>();
  @Output() readonly clicBtAction: EventEmitter<ShellActionKey> = new EventEmitter<ShellActionKey>();
  @Output() readonly clicBtMeta: EventEmitter<ShellEmitClic> = new EventEmitter<ShellEmitClic>();

  @ViewChild('snav') snav: MatSidenav | undefined;

  private readonly mobileQueryListener: () => void;

  readonly fixedTopGapDef = 56;

  readonly iconSidenavOpened = 'menu_open';
  readonly iconSidenavClosed = 'menu';

  readonly sidenavModeMobile = 'over';
  readonly sidenavModeDesktop = 'side';

  readonly logoAltDef = 'Logo';

  readonly iconMenuAction = 'more_vert';

  readonly avatarImgAltDef = 'Avatar';

  readonly mobileQuery: MediaQueryList;

  sidenavOpening: boolean | undefined;

  sidenavOpen$: Observable<BooleanInputTrueFalse> | undefined;

  constructor(changeDetectorRef: ChangeDetectorRef, mediaMatcher: MediaMatcher) {
    this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = (): void => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.sidenavOpen$ = timer(400).pipe(map(() => this.isSidenavOpened));
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

  clicLink(link: string, index: number): void {
    // sur clic sur lien on va fermer le sidenav si on est en version mobile (pas en mode side) ou qu'on a un backdrop
    if (this.snav?.disableClose !== true && (this.snav?.mode !== 'side' || this.hasBackdrop === true)) {
      this.snav?.close().catch((resu) => {
        console.warn('AppShell comp clicLink close sidenav snav resu ERREUR', resu);
      });
    }
    this.changeLinkNav.emit({ identif: link, index, type: 'S' });
  }

  trackByLinkFn(index: number, item: ShellMenuElems): string | number {
    if (menuElemIsLink(item) && item.shellLink) {
      // on est sur un lien l'identifiant est le shellLink
      return item.shellLink;
    }
    // sinon identifiant index
    return index;
  }

  trackByActionFn(index: number, item: KeyValue<ShellActionKey, ShellMenuActions>): ShellActionKey | number {
    return item.key === '' || (typeof item.key === 'number' && isNaN(item.key)) ? index : item.key;
  }

  clicAction(actionKey: ShellActionKey): void {
    this.clicBtAction.emit(actionKey);
  }

  compareKeyValueActions(): number {
    return 0;
  }

  clicMeta(evt: Event, identif: string, index: number): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.clicBtMeta.emit({ identif, index, type: 'S' });
  }

  trackByTabLinkFn(index: number, item: ShellMenuTabs): string | number {
    return item.tabLink || index;
  }

  clicTabLink(link: string, index: number): void {
    this.changeLinkNav.emit({ identif: link, index, type: 'T' });
  }
}
