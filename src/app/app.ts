import {Component, computed, inject} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {httpResource} from "@angular/common/http";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDrawer, MatDrawerContainer, MatDrawerContent,} from "@angular/material/sidenav";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import About from "./components/about";
import type Person from "./person";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import Search from './components/search';
import Table from './components/table';
import TableSettings from './components/table-settings';

const PERSONS =
  "https://ziv.github.io/angular-table-route-example/persons.json?";

@Component({
  selector: "app-root",
  imports: [
    MatPaginator,
    MatTableModule,
    MatSortModule,
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    MatTooltip,
    ReactiveFormsModule,
    Search,
    Table,
    TableSettings
  ],
  host: {
    "[style.--mat-toolbar-container-background-color]":
      '"var(--mat-sys-primary-container)"',
    "[style.--mat-toolbar-container-text-color]":
      '"var(--mat-sys-on-primary-container)"',
  },
  styles: `
    mat-toolbar {
      justify-content: space-between;
    }

    mat-drawer-container,
    mat-drawer-content {
      width: 100%;
    }

    main {
      display: flex;
      flex: 1;
      overflow-y: scroll;
    }

    section {
      margin: 1em;
    }
  `,
  template: `
    <!--
        All the "@defer {}" blocks are used to reduce the initial loading time of the application.
        Without them, the bundle size would be large and not optimized for initial loading.

        @see https://angular.dev/guide/templates/defer#defer
        -->
    @defer (on idle) {
      <mat-toolbar>
        <h1>Route as source of truth example</h1>
        <div class="search">
          <app-search (query)="update($event)"/>
        </div>

        <button [matMenuTriggerFor]="main" mat-icon-button>
          <mat-icon>menu</mat-icon>
        </button>
        <mat-menu #main>
          <button (click)="table?.toggle()"
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
    }

    <main>
      <mat-drawer-container>
        <mat-drawer mode="over" #table>
          @defer (on idle) {
            <section>
              <app-table-settings />
            </section>
          }
        </mat-drawer>
        <mat-drawer-content>
          @defer (on idle) {
            <app-table/>
          }
        </mat-drawer-content>
      </mat-drawer-container>
    </main>


    @defer (on idle) {
      <mat-paginator (page)="update({ page: $event.pageIndex, size: $event.pageSize })"
                     [pageIndex]="page()"
                     [pageSizeOptions]="[20, 40, 60]"
                     length="300"
                     pageSize="30"/>
    }
  `,
})
export default class App {
  /**
   * Static data
   * ---------------------------------------------------------------------------
   * - Table columns
   * - Table borders
   */
  protected readonly columns = [
    "id",
    "name",
    "email",
    "address",
    "city",
    "country",
    "phone",
  ];
  protected readonly border = [
    {value: "all", tip: "Border all", icon: "border_all"},
    {value: "lines", tip: "Border lines", icon: "border_horizontal"},
    {value: "none", tip: "Border none", icon: "border_clear"},
  ];
  protected readonly queryControl = new FormControl('');
  protected readonly query = toSignal(this.queryControl.valueChanges);

  /**
   * The `Router` and the `ActivatedRoute` service! Our article subject!
   * ---------------------------------------------------------------------------
   * The `Router` is used to update the route (query parameters).
   * We use the `ActivatedRoute` to get the query parameters as a signal.
   */
  protected readonly router = inject(Router);
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams);
  protected readonly dialog = inject(MatDialog);

  /**
   * Fetch data by URL.
   * The URL is dependent on the query parameters. If none are provided, it will not fetch any data (undefined URL).
   * We use default value of an empty array to avoid errors when the data is not yet available.
   */
  protected readonly data = httpResource<Person[]>(
    () =>
      this.params()
        ? PERSONS + new URLSearchParams(this.params() as Record<string, string>)
        : undefined,
    {defaultValue: []},
  );

  // protected readonly query = signal('');

  // computed properties...
  /**
   * Update the paginator with the current page index.
   */
  protected readonly page = computed<number>(() =>
    parseInt(this.params()?.["page"] ?? "0", 10)
  );

  /**
   * Update the sort state with the current active column and direction.
   */
  protected readonly sortStart = computed<Sort>(() => ({
    active: this.params()?.["active"] ?? "name",
    direction: this.params()?.["direction"] ?? "asc",
  }));

  /**
   * Update the colors selector with the current color state.
   * Used by the tableClasses to compute the CSS classes for the table.
   */
  protected readonly colorful = computed<boolean | string>(() =>
    this.params()?.["colorful"] ?? false
  );

  /**
   * Update the border selector with the current border value.
   * Used by the tableClasses to compute the CSS classes for the table.
   */
  protected readonly borders = computed<"all" | "lines" | "none">(() =>
    this.params()?.["border"] ?? "lines"
  );

  /**
   * Compute the CSS classes for the table based on the current state.
   */
  protected readonly tableClass = computed(() => {
    const classes = [];
    if (coerceBooleanProperty(this.colorful())) {
      classes.push("colorful");
    }
    const borders = this.borders();
    classes.push(borders === "all" ? "all" : borders === "none" ? "none" : "");
    return classes.join(" ");
  });

  /**
   * Compute the columns to display in the table based on the query parameters.
   */
  protected readonly displayColumns = computed(() =>
    Array.isArray(this.params()?.["cols"])
      ? this.params()?.["cols"]
      : this.columns
  );

  update(queryParams: { [key: string]: unknown }) {
    return this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });
  }

  help() {
    this.dialog.open(About);
  }
}
