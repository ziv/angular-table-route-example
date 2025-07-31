import { bootstrapApplication } from "@angular/platform-browser";
import Config from "./app/config";
import Shell from "./app/shell";

bootstrapApplication(Shell, Config).catch(console.error);
