import { Component } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
  selector: "app-login",
  imports: [
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    RouterLink,
    MatCard,
    MatCardContent,
  ],

  styles: `
    :host {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      min-width: 30em;
    }

    p {
      text-align: center;
    }
  `,
  template: `
    <form>
      <mat-card>
        <mat-card-content>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="email" value="info@example.com" placeholder="Email"/>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" value="123456" placeholder="Password"/>
          </mat-form-field>
          <a matButton routerLink="/table">LOGIN</a>
        </mat-card-content>
      </mat-card>
      <p>Just click login...</p>
    </form>
  `,
})
export default class Login {
}
