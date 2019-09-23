import {Component, Input, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import {ChatMethods} from "../../interface/networks/watermelon/conv/chat";

@Component({
  selector: "ng-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.styl"],
})
export class ChatComponent implements OnInit {
  @Input() private chat: Watermelon["commentPool"][0];
  private message: {
    type: ChatMethods
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
