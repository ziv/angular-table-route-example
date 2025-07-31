import { Component, computed, inject, input, resource } from "@angular/core";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { DomSanitizer } from "@angular/platform-browser";
import { httpResource } from "@angular/common/http";

const marked = new Marked(
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
  selector: "app-markdown",
  template: '<div [innerHTML]="content()"></div>',
})
export class Markdown {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly markdown = httpResource.text(() => this.src());
  protected readonly content = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(
      marked.parse(
        this.markdown.hasValue() ? this.markdown.value() : "",
      ) as string,
    );
  });

  readonly src = input.required<string>();
}
