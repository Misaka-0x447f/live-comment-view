import {Component} from "@angular/core";

@Component({
  selector: "ng-root",
  template: `
      <router-outlet></router-outlet>`,
  styles: [`body {
      margin: 0;
      padding: 2em;
      background-color: black;
      color: white;
      height: 100vh;
      box-sizing: border-box
  }`],
})
export class AppComponent {
}
