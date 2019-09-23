import {Component, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import {regexMatch} from "../../utils/lang";
import i18n from "../../utils/i18n";

@Component({
  selector: "ng-host",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.styl"],
})
export class DemoComponent implements OnInit {
  private worker: Watermelon;
  private JSON = JSON;
  private i18n = i18n;
  private streamer;

  constructor() {
    let r = regexMatch(window.location.hash, /#\/(.+)/);
    if (!r) {
      r = "宝蓝狼";
    }
    this.worker = new Watermelon({
      streamer: r,
    });
    this.streamer = decodeURI(r);
  }

  public ngOnInit() {
    this.worker.startWatch().then();
  }

}
