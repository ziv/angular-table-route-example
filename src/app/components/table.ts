import {Component, computed, inject} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {httpResource} from "@angular/common/http";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule, Sort} from "@angular/material/sort";
import type Person from '../person';

const PERSONS =
  "https://ziv.github.io/angular-table-route-example/persons.json?";

@Component({
  selector: "app-table",
  imports: [
    MatTableModule,
    MatSortModule,
  ],
  styles: `
    table {
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
  `,
  template: `
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

      @for (col of columns; track col) {
        <ng-container [matColumnDef]="col">
          <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ col }}</th>
          <td mat-cell *matCellDef="let item">{{ item[col] }}</td>
        </ng-container>
      }
      <tr mat-header-row *matHeaderRowDef="displayColumns();sticky:true"></tr>
      <tr mat-row *matRowDef="let row; columns: displayColumns();"></tr>
    </table>
  `,
})
export default class Table {
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
    const classes = [];
    if (coerceBooleanProperty(this.params()?.["colorful"] ?? false)) {
      classes.push("colorful");
    }
    const borders = this.params()?.["border"] ?? "lines";
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
}
