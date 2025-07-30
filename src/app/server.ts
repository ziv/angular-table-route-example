import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import {map, Observable} from "rxjs";
import type Person from "./person";

export default function server(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const url = new URL(req.urlWithParams);

  // don't mess with other requests, just our data :)
  if (!url.pathname.endsWith("persons.json")) {
    return next(req);
  }

  // take the full response and make the server tasks here...
  return next(req).pipe(map((event: HttpEvent<unknown>) => {
    if (event.type !== HttpEventType.Response) {
      return event;
    }
    let copy = event.clone() as HttpResponse<Person[]>;

    // sorting
    const active = url.searchParams.get("active") as keyof Person;
    const direction = url.searchParams.get("direction");

    if (active && direction) {
      const body = [...copy.body ?? []];
      body.sort((a: Person, b: Person) =>
        (direction === "asc")
          ? (a[active] > b[active] ? 1 : -1)
          : (a[active] < b[active] ? 1 : -1)
      );
      copy = copy.clone({body});
    }

    // pagination
    const page = parseInt(url.searchParams.get("page") ?? "0", 10);
    const size = parseInt(url.searchParams.get("size") ?? "20", 10);

    copy = copy.clone({
      body: (copy.body ?? []).slice(page * size, (page + 1) * size),
    });

    return copy;
  }));
}
