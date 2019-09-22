import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {HostComponent} from "./host/host.component";
import {ChatComponent} from "./chat/chat.component";

@NgModule({
  declarations: [
    AppComponent,
    HostComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
