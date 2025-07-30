import {Component, computed, inject, resource} from "@angular/core";
import {MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import {DomSanitizer} from '@angular/platform-browser';
import hljs from 'highlight.js';

const ABOUT = "https://ziv.github.io/angular-table-route-example/about.md";

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
export default class About {
  marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, {language}).value;
      }
    })
  );
  sanitizer = inject(DomSanitizer);
  private readonly markdown = resource({
    loader: () => fetch(ABOUT).then(res => res.text()),
  });

  protected readonly content = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.marked.parse(this.markdown.hasValue() ? this.markdown.value() : "") as string);
  });
}
