import {Component, ElementRef, output, viewChild} from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: "app-search",
  imports: [
    MatFormField,
    MatIcon,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-form-field appearance="outline">
      <input #q
             matInput
             type="text"
             placeholder="Search"
             [formControl]="queryControl"
             (keyup)="onSearch($event)">
      <mat-icon>search</mat-icon>
    </mat-form-field>
  `,
})
export default class Search {
  protected readonly input = viewChild<ElementRef>('q');
  protected readonly queryControl = new FormControl('');

  readonly query = output<{ q: string }>();

  protected onSearch(event: KeyboardEvent) {
    if ('Escape' === event.key) {
      this.queryControl.setValue('');
      this.input()?.nativeElement.focus();
    }
    if ('Enter' === event.key) {
      this.input()?.nativeElement.blur();
    }
    this.query.emit({q: this.queryControl.value as string});
  }
}
