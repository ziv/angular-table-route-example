import { Component, computed, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { toSignal } from "@angular/core/rxjs-interop";
import { httpResource } from "@angular/common/http";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from "@angular/material/sidenav";
import {
  MatFormField,
  MatLabel,
  MatOption,
  MatSelect,
} from "@angular/material/select";
import { MatTooltip } from "@angular/material/tooltip";
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from "@angular/material/button-toggle";
import { MatCheckbox } from "@angular/material/checkbox";
import { NgClass } from "@angular/common";

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
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatCheckbox,
    NgClass,
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

    table {
      width: 100%;

      &.all {
        td {
          border: 1px solid currentColor;
        }
      }

      &.none {
        td {
          border: 0;
        }
      }

      &.colorful {
        tr:nth-child(even) {
          background-color: var(--mat-sys-secondary-container);
        }
      }
    }

    section {
      margin: 1em;

      h2 {
        margin-top: 2em;
        font-weight: 300;
        font-size: 1.2rem;
      }


    }
  `,
  template: `
    <mat-toolbar>
      <h1>Route as source of truth example</h1>

      <!--
      All the "@defer {}" blocks are used to reduce the initial loading time of the application.
      Without them, the bundle size would be large and not optimized for initial loading.

      @see https://angular.dev/guide/templates/defer#defer
      -->
      @defer (on idle) {
        <button mat-icon-button [matMenuTriggerFor]="main" mastTooltip="Show menu">
          <mat-icon>menu</mat-icon>
        </button>
        <mat-menu #main>
          <button mat-menu-item (click)="table?.toggle()" matTooltip="Open table options drawer"
                  matTooltipPosition="left">
            <mat-icon>table</mat-icon>
            <span>Table options</span>
          </button>
          <button mat-menu-item matTooltip="About this example" matTooltipPosition="left">
            <mat-icon>info</mat-icon>
            <span>About</span>
          </button>
        </mat-menu>
      }
    </mat-toolbar>


    <main>
      <mat-drawer-container>
        <mat-drawer mode="over" #table>
          @defer (on idle) {
            <section>
              <h2>Columns</h2>
              <mat-form-field appearance="outline">
                <mat-label>Show columns</mat-label>
                <mat-select multiple [value]="columns" (valueChange)="update({cols: $event})">
                  @for (c of columns; track c) {
                    <mat-option [value]="c">{{ c }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <h2>Borders</h2>
              <mat-button-toggle-group hideSingleSelectionIndicator>
                @for (b of border; track b.value) {
                  <mat-button-toggle [matTooltip]="b.tip"
                                     [checked]="borders()==b.value"
                                     (click)="update({border: b.value})">
                    <mat-icon>{{ b.icon }}</mat-icon>
                  </mat-button-toggle>
                }
              </mat-button-toggle-group>

              <h2>Colors</h2>
              <mat-checkbox [checked]="colorful()" (change)="update({colorful: $event.checked})">Colorful</mat-checkbox>
            </section>
          }
        </mat-drawer>
        <mat-drawer-content>
          @defer (on idle) {
            <table (matSortChange)="update({ active: $event.active, direction: $event.direction })"
                   [dataSource]="data.value()"
                   [matSortDirection]="sortStart().direction"
                   [matSortActive]="sortStart().active"
                   [ngClass]="[borders(), colorful() ? 'colorful' : '']"
                   matSortActive="name"
                   matSortDirection="asc"
                   mat-table
                   matSort
                   matSortDisableClear>

              @for (col of columns; track col) {
                <ng-container [matColumnDef]="col">
                  <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ col }}</th>
                  <td mat-cell *matCellDef="let item">{{ item[col] }}</td>
                </ng-container>
              }
              <tr mat-header-row *matHeaderRowDef="displayColumns();sticky:true"></tr>
              <tr mat-row *matRowDef="let row; columns: displayColumns();"></tr>
            </table>
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
    { value: "all", tip: "Border all", icon: "border_all" },
    { value: "lines", tip: "Border lines", icon: "border_horizontal" },
    { value: "none", tip: "Border none", icon: "border_clear" },
  ];

  /**
   * The `Router` and the `ActivatedRoute` service! Our article subject!
   * ---------------------------------------------------------------------------
   * The `Router` is used to update the route (query parameters).
   * We use the `ActivatedRoute` to get the query parameters as a signal.
   */
  protected readonly router = inject(Router);
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams);

  /**
   * Fetch data by URL.
   * The URL is dependent on the query parameters. If none are provided, it will not fetch any data (undefined URL).
   * We use default value of an empty array to avoid errors when the data is not yet available.
   */
  protected readonly data = httpResource<any[]>(
    () =>
      this.params()
        ? `http://localhost:4200/persons.json?${
          new URLSearchParams(this.params() as Record<string, string>)
            .toString()
        }`
        : undefined,
    { defaultValue: [] },
  );

  // computed properties...
  protected readonly page = computed<number>(() =>
    parseInt(this.params()?.["page"] ?? "0", 10)
  );
  protected readonly borders = computed<"all" | "lines" | "none">(() =>
    this.params()?.["border"] ?? "lines"
  );
  protected readonly sortStart = computed<Sort>(() => ({
    active: this.params()?.["active"] ?? "name",
    direction: this.params()?.["direction"] ?? "asc",
  }));
  protected readonly colorful = computed<boolean>(() =>
    this.params()?.["colorful"] ?? false
  );
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
}
