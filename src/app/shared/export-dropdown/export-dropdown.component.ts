import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
declare let $: any;

@Component({
  selector: "app-export-dropdown",
  templateUrl: "./export-dropdown.component.html",
  styleUrls: ["./export-dropdown.component.scss"],
})
export class ExportDropdownComponent implements OnInit {
  show: boolean;
  @Output() select: EventEmitter<any> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {
    const component = this;
    $(document).mouseup(function (e: any) {
      const container = $(".dropdown-box");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        component.show = false;
        component.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {}

  onSelect(format) {
    this.show = false;
    this.select.emit(format);
  }
}
