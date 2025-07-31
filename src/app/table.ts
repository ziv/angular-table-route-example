import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { httpResource } from "@angular/common/http";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from "@angular/material/sidenav";
import type Person from "./person";
import { ReactiveFormsModule } from "@angular/forms";
import TableSettings from "./components/table-settings";
import Toolbar from "./components/toolbar";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatProgressBar } from "@angular/material/progress-bar";

const PERSONS =
  "https://ziv.github.io/angular-table-route-example/persons.json?";

@Component({
  selector: "app-root",
  imports: [
    MatPaginator,
    MatTableModule,
    MatSortModule,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    ReactiveFormsModule,
    TableSettings,
    Toolbar,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatProgressBar,
  ],

  styles: `
    mat-drawer-container,
    mat-drawer-content {
      width: 100%;
    }

    main {
      display: flex;
      flex: 1;
      overflow-y: scroll;
    }

    .loading-shade {
      background: rgba(0, 0, 255, 0.05);
      z-index: 99999;
      display: flex;
    }

    mat-form-field, table {
      width: 100%;
    }

    table.all td {
      border: 1px solid currentColor;
    }

    table.none td {
      border: 0;
    }

    table.colorful tr:nth-child(even) {
      background-color: var(--mat-sys-secondary-container);
    }

    section {
      margin: 1em;
    }

    article {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `,
  template: `
    <!--
      All the "@defer {}" blocks are used to reduce the initial loading time of the application.
      Without them, the bundle size would be large and not optimized for initial loading.

      @see https://angular.dev/guide/templates/defer#defer
    -->
    @defer (on idle) {
      <app-toolbar (settings)="settings.toggle()"/>
      <!--
      The search bar updates the query parameters.
      -->
      <mat-form-field class="search">
        <mat-label>Search</mat-label>
        <input #input
               matInput
               type="text"
               placeholder="Search" (keyup)="update({q: input.value, page: 0})">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    }

    <main>
      <mat-drawer-container>
        <mat-drawer mode="over" #settings>
          @defer (on idle) {
            <!--
            The settings updates the query parameters.
            -->
            <section>
              <app-table-settings (settings)="update($event)"/>
            </section>
          }
        </mat-drawer>
        <mat-drawer-content>
          @if (data.isLoading()) {
            <div class="loading-shade abs-container">
              <mat-progress-bar mode="indeterminate"/>
            </div>
          }
          @if (data.error()) {
            <article class="abs-container">
              <h2>Error loading data</h2>
              <p>{{ data.error() }}</p>
            </article>
          }
          @defer (on idle) {
            <!--
            The sorter updates the query parameters.
            -->
            <table (matSortChange)="update({ active: $event.active, direction: $event.direction })"
                   [dataSource]="data.value()"
                   [matSortDirection]="sortStart().direction"
                   [matSortActive]="sortStart().active"
                   [class]="tableClass()"
                   matSortActive="name"
                   matSortDirection="asc"
                   mat-table
                   matSort
                   matSortDisableClear>

              <!--
              We prepare all column templates, even those we do not display.
              -->
              @for (col of columns; track col) {
                <ng-container [matColumnDef]="col">
                  <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ col }}</th>
                  <td mat-cell *matCellDef="let item">{{ item[col] }}</td>
                </ng-container>
              }

              <!--
              "matNoDataRow" is used to display a message when there is no data available.
              Use the "columns.length" to set the colspan of the cell. "attr.<name>" is used
              to bind the attribute dynamically when Angular does not support it directly.
              -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" [attr.colspan]="displayColumns().length">
                  <article>
                    <h2>No data available</h2>
                    <p>Try change your query...</p>
                    <p>You search for "{{ params()?.['q'] ?? '' }}"</p>
                  </article>
                </td>
              </tr>

              <tr mat-header-row *matHeaderRowDef="displayColumns();sticky:true"></tr>
              <tr mat-row *matRowDef="let row; columns: displayColumns();"></tr>
            </table>
          }

        </mat-drawer-content>
      </mat-drawer-container>
    </main>


    @defer (on idle) {
      <!--
      The paginator updates the query parameters.
      -->
      <mat-paginator (page)="update({ page: $event.pageIndex, size: $event.pageSize })"
                     [pageIndex]="page()"
                     [pageSizeOptions]="[20, 40, 60]"
                     length="300"
                     pageSize="30"/>
    }
  `,
})
export default class Table {
  // static data
  protected readonly columns = [
    "id",
    "name",
    "email",
    "address",
    "city",
    "country",
    "phone",
  ];

  /**
   * Injecting the state management services, the Router and ActivatedRoute.
   */
  protected readonly router = inject(Router);
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams);

  /**
   * Fetch data by URL.
   * The URL is dependent on the query parameters signal.
   */
  protected readonly data = httpResource<Person[]>(
    () =>
      this.params()
        ? PERSONS + new URLSearchParams(this.params() as Record<string, string>)
        : undefined,
    { defaultValue: [] },
  );

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
   * Compute the CSS classes for the table based on the current state.
   */
  protected readonly tableClass = computed(() => {
    let classes = "";
    if (coerceBooleanProperty(this.params()?.["colorful"] ?? false)) {
      classes += "colorful ";
    }
    const borders = this.params()?.["border"] ?? "lines";
    classes += borders === "all" ? "all" : borders === "none" ? "none" : "";
    return classes;
  });

  /**
   * Compute the columns to display in the table based on the query parameters.
   */
  protected readonly displayColumns = computed(() =>
    Array.isArray(this.params()?.["cols"])
      ? this.params()?.["cols"]
      : this.columns
  );

  /**
   * Update the query parameters based on the provided key-value pairs.
   * The new query parameters will be merged with the existing ones unless specified otherwise.
   */
  update(params: unknown, handling: "merge" | "replace" = "merge") {
    return this.router.navigate([], {
      queryParams: params as { [key: string]: unknown },
      queryParamsHandling: handling,
    });
  }
}
