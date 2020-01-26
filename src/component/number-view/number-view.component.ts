import {Component, Input, OnInit} from "@angular/core";
import { numberCompact } from "../../utils/lang";

@Component({
  selector: "ng-number-view",
  templateUrl: "./number-view.component.html",
  styleUrls: ["./number-view.component.styl"],
})
export class NumberViewComponent implements OnInit {
  @Input() private label: string;
  @Input() private number: number;
  private numberCompact = numberCompact;
  constructor() {
  }

  public ngOnInit() {
  }

}
