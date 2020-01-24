import {Component, Input, OnInit} from "@angular/core";
import numeral from "numeral";

@Component({
  selector: "ng-number-view",
  templateUrl: "./number-view.component.html",
  styleUrls: ["./number-view.component.styl"],
})
export class NumberViewComponent implements OnInit {
  @Input() private label: string;
  @Input() private number: number;
  private numeral = numeral;
  constructor() {
  }

  public ngOnInit() {
  }

}
