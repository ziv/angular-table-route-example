import { bootstrapApplication } from "@angular/platform-browser";
import Config from "./app/config";
import App from "./app/app";

bootstrapApplication(App, Config).catch(console.error);
