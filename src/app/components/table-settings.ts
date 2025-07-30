import {Component, effect, inject} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel, MatOption, MatSelect,} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {MatButtonToggle, MatButtonToggleGroup,} from "@angular/material/button-toggle";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: "app-table-settings",
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatCheckbox,
    ReactiveFormsModule,
  ],
  styles: `
    h2 {
      margin-top: 2em;
      font-weight: 300;
      font-size: 1.2rem;
    }
  `,
  template: `
    <h2>Columns</h2>
    <mat-form-field appearance="outline">
      <mat-label>Show columns</mat-label>
      <mat-select multiple [formControl]="form.controls.cols">
        @for (c of columns; track c) {
          <mat-option [value]="c">{{ c }}</mat-option>
        }
      </mat-select>
    </mat-form-field>

    <h2>Borders</h2>
    <mat-button-toggle-group [formControl]="form.controls.border" hideSingleSelectionIndicator>
      @for (b of border; track b.value) {
        <mat-button-toggle [matTooltip]="b.tip">
          <mat-icon>{{ b.icon }}</mat-icon>
        </mat-button-toggle>
      }
    </mat-button-toggle-group>

    <h2>Colors</h2>
    <mat-checkbox [formControl]="form.controls.colorful">Colorful</mat-checkbox>
  `,
})
export default class TableSettings {
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

  // form and router
  protected readonly router = inject(Router);
  protected readonly form = new FormGroup({
    cols: new FormControl<string[]>(this.columns),
    colorful: new FormControl<boolean>(false),
    border: new FormControl<"all" | "lines" | "none">("lines"),
  });
  readonly params = toSignal(this.form.valueChanges);


  constructor() {
    effect(() => {
      return this.router.navigate([], {
        queryParams: this.params(),
        queryParamsHandling: "merge",
      });
    });
  }
}
