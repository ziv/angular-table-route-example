import { Component, computed, inject, input, resource } from "@angular/core";
import { MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { Marked as MarkedMd } from "marked";
import { markedHighlight } from "marked-highlight";
import { DomSanitizer } from "@angular/platform-browser";
import hljs from "highlight.js";
import { httpResource } from "@angular/common/http";

const ABOUT = "https://ziv.github.io/angular-table-route-example/about.md";

const marked = new MarkedMd(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight: (code, lang) =>
      hljs.highlight(code, {
        language: hljs.getLanguage(lang) ? lang : "plaintext",
      }).value,
  }),
);

@Component({
  selector: "app-about",
  imports: [
    MatDialogTitle,
    MatDialogContent,
  ],
  template: `
    <h2 matDialogTitle>About</h2>
    <mat-dialog-content [innerHTML]="content()"></mat-dialog-content>
  `,
})
export default class Marked {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly resource = httpResource.text(() => this.source());

  protected readonly content = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      marked.parse(
        this.resource.hasValue() ? this.resource.value() : "",
      ) as string,
    )
  );

  readonly source = input.required<string>();
}
