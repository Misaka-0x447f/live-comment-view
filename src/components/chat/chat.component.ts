import { Component, Input, OnInit } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { register } from "../../interface/networks/watermelon/register";

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
  @Input() private breadcrumb: string;
  @Input() private badge: string;
  @Input() private content: string;
  @Input() private isSubscriber: boolean;

  get filteredUserName() {
    let s = this.breadcrumb;
    for (const value of register.replaceUsername) {
      s = s.replace(value[0], value[1]);
    }
    return s;
  }

  constructor() {
  }

  public ngOnInit() {
  }

}
