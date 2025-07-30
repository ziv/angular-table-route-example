import { Component } from "@angular/core";
import { MatDialogContent, MatDialogTitle } from "@angular/material/dialog";

@Component({
  selector: "app-about",
  imports: [
    MatDialogTitle,
    MatDialogContent,
  ],
  template: `
    <h2 matDialogTitle>About</h2>
    <mat-dialog-content>
      <p>content</p>
      <p>content</p>
      <p>content</p>
      <p>content</p>
      <p>content</p>
      <p>content</p>
    </mat-dialog-content>
  `,
})
export default class About {
}
