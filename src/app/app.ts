import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {toSignal} from '@angular/core/rxjs-interop';
import {httpResource} from '@angular/common/http';

type Person = {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

@Component({
  selector: 'app-root',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    section {
      display: flex;
      flex: 1;
      overflow-y: scroll;
    }
  `,
  template: `
    <h1>Route as source of truth example</h1>
    <section>
      <table (matSortChange)="updateQuery({ active: $event.active, direction: $event.direction })"
             [dataSource]="data.value()"
             [matSortDirection]="sortStart().direction"
             [matSortActive]="sortStart().active"
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
        <tr mat-header-row *matHeaderRowDef="columns;sticky:true"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </section>
    <mat-paginator (page)="updateQuery({ page: $event.pageIndex, size: $event.pageSize })"
                   length="300"
                   pageSize="30"
                   [pageSizeOptions]="[5, 15, 30]"/>
  `
})
export class App {
  // table
  protected readonly columns = ['id', 'name', 'email', 'address', 'city', 'country'];

  /**
   * The Angular Router is needed to update the route.
   * @protected
   */
  protected readonly router = inject(Router);

  /**
   * We use the ActivatedRoute to get the query parameters as a signal.
   * @protected
   */
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams);

  protected readonly sortStart = computed(() => ({
    active: this.params()?.['active'] ?? 'name',
    direction: this.params()?.['direction'] ?? 'asc',
  }))

  /**
   * The URL build from the query parameters to fetch data.
   * @protected
   */
  protected readonly dataUrl = computed(() => {
    const params = this.params();
    if (!params) {
      return undefined;
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return `http://localhost:4200/persons.json?${query}`;
  });


  /**
   * The data is fetched from the server using the URL built from the query parameters.
   * The default value is an empty array.
   * @protected
   */
  protected readonly data = httpResource<Person[]>(() => this.dataUrl(), {defaultValue: []});

  updateQuery(queryParams: { [key: string]: unknown }) {
    return this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
