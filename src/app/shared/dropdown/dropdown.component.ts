import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {

  @Input() items;
  @Input() icon;
  @Input() filled

  @Output() select: EventEmitter<any> = new EventEmitter();

  showDropDown = false;
  selectedOption: any;

  // close dropdown menu in case clicked outside it
  @HostListener('document:click', ['$event']) onclick(evt: any) {
    if (!this.eRef.nativeElement.contains(evt.target)) {
      this.showDropDown = false;
    }
  }

  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {}

  handleDropdown() {
    this.showDropDown = !this.showDropDown;
    window.dispatchEvent(new Event('resize'));
  }

  selectedItem(item) {
    this.select.emit(item);
    this.selectedOption = item;
  }
}
