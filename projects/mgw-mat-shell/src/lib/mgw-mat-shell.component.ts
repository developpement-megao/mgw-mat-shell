import { KeyValue, KeyValuePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MediaMatcher } from '@angular/cdk/layout';

import { ThemePalette } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';

import { MatListModule } from '@angular/material/list';
import { LinkIsActiveLinkPipe } from './link-is-active-link.pipe';
import { MenuElemGetGroupPipe } from './menu-elem-get-group.pipe';
import { MenuElemGetLinkPipe, menuElemIsLink } from './menu-elem-get-link.pipe';

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
  template: `
    <div class="shell-container" [class.device-is-mobile]="mobileQuery.matches">
      <mat-toolbar class="shell-toolbar" [color]="toolbarColor">
        <button *ngIf="linksList" mat-icon-button type="button" aria-label="Ouverture menu principal" (click)="toggleSidenav()">
          <mat-icon>{{ sidenavOpening ? snavIconOpened || iconSidenavOpened : snavIconClosed || iconSidenavClosed }}</mat-icon>
        </button>
        <img *ngIf="appLogo" [src]="appLogo" [alt]="appTitle || logoAltDef" class="app-logo" />
        <h1 *ngIf="appTitle" class="app-name">{{ appTitle }}</h1>
        <span class="toolbar-spacer"></span>
        <button *ngIf="actionsList" mat-icon-button type="button" [matMenuTriggerFor]="menu" aria-label="Menu action">
          <mat-icon>{{ menuActionIcon || iconMenuAction }}</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button *ngFor="let item of actionsList | keyvalue: compareKeyValueActions; trackBy: trackByActionFn" mat-menu-item (click)="clicAction(item.key)">
            <mat-icon *ngIf="item.value.menuIco">{{ item.value.menuIco }}</mat-icon>
            <span>{{ item.value.menuText }}</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="shell-sidenav-container" [style.marginTop.px]="mobileQuery.matches ? 56 : 0">
        <mat-sidenav
          #snav
          [mode]="forceMode ?? (mobileQuery.matches ? forceModeMobile ?? sidenavModeMobile : forceModeDesktop ?? sidenavModeDesktop)"
          [disableClose]="sidenavDisableClose"
          [fixedInViewport]="mobileQuery.matches"
          fixedTopGap="56"
          [(opened)]="isSidenavOpened"
          (openedStart)="sidenavOpenedStart()"
          (openedChange)="sidenavOpenedChange($event)">
          <mat-nav-list>
            <ng-container *ngFor="let lk of linksList; trackBy: trackByLinkFn">
              <div *ngIf="lk | menuElemGetGroup as lkGrp" mat-subheader>{{ lkGrp.groupLibelle }}</div>
              <a
                *ngIf="lk | menuElemGetLink as lkLink"
                mat-list-item
                [routerLink]="lkLink.shellLink"
                [activated]="lkLink.shellLink | linkIsActiveLink: activeLink"
                (click)="clicLink(lkLink.shellLink)">
                <mat-icon *ngIf="lkLink.linkIcone" matListItemIcon [class.icon-subtitle]="lkLink.linkSubtitle">{{ lkLink.linkIcone }}</mat-icon>
                <div matListItemTitle>{{ lkLink.linkLabel }}</div>
                <div *ngIf="lkLink.linkSubtitle" matListItemLine>{{ lkLink.linkSubtitle }}</div>
              </a>
              <mat-divider *ngIf="lk === true"></mat-divider>
            </ng-container>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content *ngIf="contentTemplate">
          <ng-container [ngTemplateOutlet]="contentTemplate"></ng-container>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      .shell-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      .device-is-mobile .shell-toolbar {
        position: fixed;
        z-index: 2;
      }

      h1.app-name {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .shell-sidenav-container {
        flex: 1;
      }

      .device-is-mobile .shell-sidenav-container {
        flex: 1 0 auto;
      }

      .mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start.icon-subtitle {
        margin-top: 23px;
      }

      h1.app-name,
      img.app-logo {
        margin-left: 8px;
      }

      img.app-logo {
        height: 48px;
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      @media screen and (max-width: 242px) {
        img.app-logo {
          display: none;
        }
      }
    `
  ]
})
export class MgwMatShellComponent implements OnDestroy {
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
