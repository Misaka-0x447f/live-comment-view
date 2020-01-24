import {Component, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import {getParams} from "../../utils/dom";
import {includeAll} from "../../utils/lang";
import {Router} from "@angular/router";
import i18n from "../../utils/i18n";

@Component({
  selector: "ng-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.styl"],
})
export class ViewComponent implements OnInit {
  private worker: Watermelon;
  private params: Partial<Record<"streamer", string>> = getParams();

  private i18n = i18n;

  constructor(private router: Router) {
    if (!includeAll(this.params, ["streamer"])) {
      this.router.navigateByUrl("/").then();
    }
    console.log(this.params.streamer);
    this.worker = new Watermelon({
      streamer: this.params.streamer,
    });
  }

  public ngOnInit() {
    this.worker.startWatch().then();
  }
}
