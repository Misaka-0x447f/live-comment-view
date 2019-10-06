import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";
import {DemoComponent} from "./demo/demo.component";
import {ViewComponent} from "./view/view.component";

import {ChatComponent} from "../component/chat/chat.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GiftComponent} from "../component/gift/gift.component";

const routes: Routes = [
  {path: "view", component: ViewComponent},
  {path: "demo", component: DemoComponent},
  {path: "**", redirectTo: "/config"},
];

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    ChatComponent,
    ViewComponent,
    GiftComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      routes,
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
