import {Component, OnInit} from "@angular/core";
import i18n from "../../utils/i18n";

@Component({
  selector: "ng-offline-overlay",
  templateUrl: "./offline-overlay.component.html",
  styleUrls: ["./offline-overlay.component.styl"],
})
export class OfflineOverlayComponent implements OnInit {
  private i18n = i18n;

  constructor() {
  }

  public ngOnInit() {
  }

}
