import {Component, Input, OnInit} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
  @Input() private username: string;
  @Input() private content: string;

  constructor() {
  }

  public ngOnInit() {
  }

}
