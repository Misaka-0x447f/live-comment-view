import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";
import {DemoComponent} from "./demo/demo.component";
import {ViewComponent} from "./view/view.component";

import {InfoComponent} from "../component/info/info.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GiftComponent} from "../component/gift/gift.component";
import {OfflineOverlayComponent} from "../component/offline-overlay/offline-overlay.component";
import {ChatComponent} from "../component/chat/chat.component";

const routes: Routes = [
  {path: "view", component: ViewComponent},
  {path: "demo", component: DemoComponent},
  {path: "**", redirectTo: "/config"},
];

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    InfoComponent,
    ViewComponent,
    GiftComponent,
    OfflineOverlayComponent,
    ChatComponent,
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
