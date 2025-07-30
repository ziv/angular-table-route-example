import {Component, inject, output} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import About from './about';

@Component({
  selector: "app-toolbar",
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatToolbar,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
  ],
  host: {
    "[style.--mat-toolbar-container-background-color]":
      '"var(--mat-sys-primary)"',
    "[style.--mat-toolbar-container-text-color]":
      '"var(--mat-sys-on-primary)"',
  },
  styles: `
    mat-toolbar {
      justify-content: space-between;
    }

    mat-icon {
      color: var(--mat-sys-on-primary);
    }
  `,
  template: `
    <mat-toolbar>
      <h1>Route as source of truth example</h1>
      <button [matMenuTriggerFor]="main" mat-icon-button>
        <mat-icon>menu</mat-icon>
      </button>
      <mat-menu #main>
        <button (click)="settings.emit()"
                mat-menu-item
                matTooltip="Open table options drawer"
                matTooltipPosition="left">
          <mat-icon>table</mat-icon>
          <span>Table options</span>
        </button>
        <button (click)="help()"
                mat-menu-item
                matTooltip="About this example"
                matTooltipPosition="left">
          <mat-icon>info</mat-icon>
          <span>About</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
})
export default class Toolbar {
  protected readonly dialog = inject(MatDialog);
  readonly settings = output();

  protected help() {
    this.dialog.open(About);
  }
}
