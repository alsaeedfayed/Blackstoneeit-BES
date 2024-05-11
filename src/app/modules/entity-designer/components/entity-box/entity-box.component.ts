import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-entity-box",
  templateUrl: "./entity-box.component.html",
  styleUrls: ["./entity-box.component.scss"],
})
export class EntityBoxComponent implements OnInit {

  @Input() label: string = "";
  @Input() img: string = "";
  @Input() drag: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
