import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";
import {DemoComponent} from "./demo/demo.component";
import {ViewComponent} from "./view/view.component";

import {InfoComponent} from "../components/info/info.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OfflineOverlayComponent} from "../components/offline-overlay/offline-overlay.component";
import {ChatComponent} from "../components/chat/chat.component";
import { NumberViewComponent } from "../components/number-view/number-view.component";
import { StatusComponent } from "../components/status/status.component";

const routes: Routes = [
  {path: "view", component: ViewComponent},
  {path: "demo", component: DemoComponent},
  {path: "**", redirectTo: "/view?streamer=宝蓝狼"},
];

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    InfoComponent,
    ViewComponent,
    OfflineOverlayComponent,
    ChatComponent,
    NumberViewComponent,
    StatusComponent,
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
