import { Component } from "@angular/core";
import { MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { Markdown } from "./components/markdown";

@Component({
  selector: "app-about",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    Markdown,
  ],
  template: `
    <h2 matDialogTitle>About</h2>
    <mat-dialog-content>
      <app-markdown [src]="about"/>
    </mat-dialog-content>
  `,
})
export default class About {
  about = "https://ziv.github.io/angular-table-route-example/about.md";
}
