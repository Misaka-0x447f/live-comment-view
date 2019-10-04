import {Component, Input, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import i18n from "../../utils/i18n";
import {isNil} from "lodash-es";
import {ChatMethods} from "../../interface/networks/watermelon/util/type";

@Component({
  selector: "ng-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.styl"],
})
export class ChatComponent implements OnInit {
  @Input() private chat: Watermelon["pool"]["comment"][0];
  private i18n = i18n;
  private isNil = isNil;

  private message: {
    type: ChatMethods;
    user: string;
    text: string;
  };

  constructor() {
  }

  public ngOnInit() {
    this.message = {
      type: this.chat.method,
      user: this.chat.user.name,
      text: this.chat.content,
    };
  }

}
