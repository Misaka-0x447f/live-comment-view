import {Component, OnInit} from "@angular/core";
import {Watermelon} from "../../interface/networks/watermelon/interfaces/watermelon";
import {getParams} from "../../utils/dom";
import {includeAll} from "../../utils/lang";
import {Router} from "@angular/router";
import i18n from "../../utils/i18n";
import { defaultTo } from "lodash-es";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "ng-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.styl"],
  animations: [
    trigger("new", [
      state("new", style({
        background: "rgba(192,255,0,0)",
      })),
      transition(":enter", [
        style({
          background: "rgba(192,255,0,0.6)",
        }),
        animate("300ms 1200ms ease-out"),
      ]),
    ]),
    trigger("newComment", [
      state("newComment", style({
        background: "transparent",
      })),
      transition(":enter", [
        style({
          background: "rgba(255, 255, 255, 0.6)",
        }),
        animate("300ms 600ms ease-out"),
      ]),
    ]),
  ],
})
export class ViewComponent implements OnInit {
  private worker: Watermelon;
  private params: Partial<Record<"streamer" | "badge", string>> = getParams();

  private i18n = i18n;

  constructor(private router: Router) {
    if (!includeAll(this.params, ["streamer"])) {
      this.router.navigateByUrl("/").then();
    }
    this.worker = new Watermelon({
      streamer: this.params.streamer,
      badge: defaultTo(this.params.badge, i18n.common.labels.subscribed),
    });
  }

  public ngOnInit() {
    this.worker.startWatch().then();
  }
}
