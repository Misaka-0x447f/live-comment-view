import {Component, Input, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import i18n from "../../utils/i18n";

@Component({
  selector: "ng-gift",
  templateUrl: "./gift.component.html",
  styleUrls: ["./gift.component.styl"],
})
export class GiftComponent implements OnInit {
  @Input() private worker: Watermelon;

  private i18n = i18n;

  constructor() {
  }

  public ngOnInit() {
  }

}
