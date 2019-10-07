import {Component, Input, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import i18n from "../../utils/i18n";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: "ng-gift",
  templateUrl: "./gift.component.html",
  styleUrls: ["./gift.component.styl"],
  animations: [
    trigger("new", [
      state("new", style({
        background: "rgba(192,255,0,0)",
      })),
      transition(":enter", [
        style({
          background: "rgba(192,255,0,0.6)",
        }),
        animate(1000),
      ]),
    ]),
  ],
})

export class GiftComponent implements OnInit {
  @Input() private worker: Watermelon;

  private i18n = i18n;

  constructor() {
  }

  public ngOnInit() {
  }

}
