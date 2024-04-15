export interface ShellEmitClic {
  identif: string;
  index: number;
  /** Permet de savoir depuis quel menu de navigation on a déclenché la navigation :
   * * S = Sidenav (on a cliqué sur un lien du menu sidenav)
   * * T = Tab (on a cliqué sur une tab de navigation)
   */
  type: 'S' | 'T';
}
