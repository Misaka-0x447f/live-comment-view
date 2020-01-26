import { Component, Input, OnInit } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";

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
    return this.breadcrumb.replace(new RegExp("用户\\d{8,13}"), "用户");
  }

  constructor() {
  }

  public ngOnInit() {
  }

}
