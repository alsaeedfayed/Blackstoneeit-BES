import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-success-state",
  templateUrl: "./success-state.component.html",
  styleUrls: ["./success-state.component.scss"],
})

export class SuccessStateComponent implements OnInit {

  @Input() title;
  @Input() description;

  constructor() {}

  ngOnInit() {}
}
