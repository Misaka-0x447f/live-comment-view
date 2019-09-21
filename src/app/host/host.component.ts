import {Component, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";

@Component({
  selector: "ng-host",
  templateUrl: "./host.component.html",
  styleUrls: ["./host.component.styl"],
})
export class HostComponent implements OnInit {
  private worker = new Watermelon({
    streamer: "宝蓝狼",
  });
  private JSON = JSON;

  constructor() {
    this.worker.startWatch();
  }

  public ngOnInit() {
  }

}
