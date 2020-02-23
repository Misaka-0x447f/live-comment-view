import { Component, Input, OnInit } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import {isChatMessage} from "../../interface/networks/watermelon/util/type";
import i18n from "../../utils/i18n";

@Component({
  selector: "ng-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.styl"],
  animations: [
    trigger("construct", [
      state("final", style({
        opacity: 1,
      })),
      transition("void => *", [
        style({
          opacity: 0,
        }),
        animate(600),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit {
  @Input() private iterate: Watermelon["pool"]["commentAndGift"][0];
  @Input() private worker: Watermelon;

  private i18n = i18n;

  get isSubscriber() {
    if (!isChatMessage(this.iterate)) {
      return false;
    }
    return this.iterate.content.user.brand === this.worker.status.room.followerInfo.title;
  }

  constructor() {
  }

  public ngOnInit() {
  }

}
