import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Layout } from 'src/app/layout/layout-routing.service';
declare var $: any;

@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidePanelComponent implements OnInit {
  @Input() title;
  @Input() name;
  @Input() displayHeader;
  @Input() wideModal;
  languageState

  @Output() sidePanelClosed: EventEmitter<any> = new EventEmitter();

  constructor(private layoutService: Layout) { }

  ngOnInit(): void {
    $('#side-panel').on('hidden.bs.modal', e => {
      this.onClose();
    })
  }

  onClose() {
    this.sidePanelClosed.emit()
  }
}
