import {Component, Input, OnInit} from "@angular/core";
import i18n from "../../utils/i18n";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";

@Component({
  selector: "ng-offline-overlay",
  templateUrl: "./offline-overlay.component.html",
  styleUrls: ["./offline-overlay.component.styl"],
})
export class OfflineOverlayComponent implements OnInit {
  @Input() private worker: Watermelon;
  private i18n = i18n;

  constructor() {
  }

  public ngOnInit() {
  }

}
