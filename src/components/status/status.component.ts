import { Component, Input, OnInit } from "@angular/core";
import { Watermelon } from "../../interface/networks/watermelon/interfaces/watermelon";
import { numberCompact } from "src/utils/lang";
import { i18n } from "src/utils/i18n";

@Component({
  selector: "ng-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.styl"],
})
export class StatusComponent implements OnInit {
  @Input() private worker: Watermelon;
  private i18n = i18n;
  private numberCompact = numberCompact;

  constructor() {
  }

  public ngOnInit() {
  }

}
